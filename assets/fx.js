/* Vogelkop · capa de efectos: revelado, parallax, progreso, header, contadores y brillo.
   En teléfonos (pantalla chica o táctil) activa el modo ligero: sin parallax ni brillo del cursor,
   y avisa al visor 3D (window.VKFX.lite) para que baje calidad y fps. */
(function () {
  var doc = document.documentElement;
  var mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var lite = mq('(max-width: 900px)') || mq('(pointer: coarse)');
  var FX = window.VKFX = { lite: lite, reduce: reduce, ready: false, onReady: [] };
  doc.classList.add('fx'); if (lite) doc.classList.add('fx-lite');

  // "listo" = página cargada y navegador ocioso: ahí arrancan los visores 3D, sin competir con el primer pintado
  FX.whenReady = function (cb) { if (FX.ready) cb(); else FX.onReady.push(cb); };
  function markReady() { if (FX.ready) return; FX.ready = true; FX.onReady.splice(0).forEach(function (f) { f(); }); }
  window.addEventListener('load', function () {
    var go = function () { setTimeout(markReady, lite ? 400 : 0); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 200);
  });

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    var amb = document.createElement('div');
    amb.className = 'fx-ambient'; amb.setAttribute('aria-hidden', 'true');
    amb.innerHTML = '<i></i><i></i><i></i>';
    document.body.insertBefore(amb, document.body.firstChild);
    var bar = document.createElement('div'); bar.className = 'fx-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    // revelado al entrar en pantalla, con escalonado por lote
    var io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.setProperty('--fx-d', Math.min(n++ * (lite ? 60 : 90), 360) + 'ms');
        el.classList.add('fx-in');
        io.unobserve(el);
        if (el.classList.contains('fx-count')) count(el);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }) : null;

    // contadores: anima el primer número del elemento conservando su formato
    function count(el) {
      if (el.__fxc) return; el.__fxc = true;
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), node;
      while ((node = w.nextNode()) && !/\d/.test(node.data)) {}
      if (!node) return;
      var m = node.data.match(/\d[\d.,]*/); if (!m) return;
      var raw = m[0], comma = raw.indexOf(',') > -1, dots = raw.indexOf('.') > -1;
      var dec = comma ? raw.split(',')[1].length : 0;
      var target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
      var pre = node.data.slice(0, m.index), post = node.data.slice(m.index + raw.length);
      function fmt(v) {
        var s = v.toFixed(dec), parts = s.split('.'), int = parts[0];
        if (dots) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return int + (dec ? ',' + parts[1] : '');
      }
      var t0 = performance.now(), dur = 1400;
      (function tick(now) {
        var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        node.data = pre + fmt(target * e) + post;
        if (k < 1) requestAnimationFrame(tick); else node.data = pre + raw + post;
      })(t0);
    }

    var pars = [], useParallax = !lite && !reduce;
    function scan(root) {
      if (!root.querySelectorAll) return;
      root.querySelectorAll('.rv, .rv-line, .fx-count').forEach(function (el) {
        if (el.__fxo) return; el.__fxo = true;
        if (io) io.observe(el); else el.classList.add('fx-in');
      });
      if (useParallax) root.querySelectorAll('.fx-par').forEach(function (el) { if (!el.__fxp) { el.__fxp = true; pars.push(el); } });
    }
    scan(document);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n.parentNode || n); }); });
      if (useParallax) pars = pars.filter(function (el) { return el.isConnected; });
      req();
    }).observe(document.body, { childList: true, subtree: true });

    // scroll: solo escribe en la barra, el header y las imágenes con parallax (nada en la raíz del documento)
    var ticking = false, scrolled = null, hd = null;
    function onScroll() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight, h = document.documentElement.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0).toFixed(4) + ')';
      if (!hd || !hd.isConnected) { hd = document.querySelector('header'); scrolled = null; }
      var s = y > 12;
      if (hd && s !== scrolled) { scrolled = s; hd.classList.toggle('fx-scrolled', s); }
      for (var i = 0; i < pars.length; i++) {
        var el = pars[i], r = el.parentNode.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        el.style.translate = '0 ' + (((r.top + r.height / 2 - vh / 2) / vh) * -6).toFixed(2) + '%';
      }
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    req();

    // brillo que sigue al cursor (solo con mouse)
    if (!lite) document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.fx-spot'); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });
})();
