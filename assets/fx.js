/* Vogelkop · capa de efectos: revelado, parallax, progreso, header, contadores y brillo */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('fx');

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    // ambiente y barra de progreso
    var amb = document.createElement('div');
    amb.className = 'fx-ambient'; amb.setAttribute('aria-hidden', 'true');
    amb.innerHTML = '<div class="fx-orbs"><i></i><i></i><i></i></div>';
    document.body.insertBefore(amb, document.body.firstChild);
    var bar = document.createElement('div'); bar.className = 'fx-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    // revelado al entrar en pantalla, con escalonado por lote
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.setProperty('--fx-d', Math.min(n++ * 90, 450) + 'ms');
        el.classList.add('fx-in');
        io.unobserve(el);
        if (el.classList.contains('fx-count')) count(el);
        el.querySelectorAll && el.querySelectorAll('.fx-count').forEach(function (c) { if (!c.__fxc) count(c); });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;

    // contadores: anima el primer número del elemento conservando su formato
    function count(el) {
      if (el.__fxc) return; el.__fxc = true;
      if (reduce) return;
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
      var t0 = performance.now(), dur = 1600;
      (function tick(now) {
        var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        node.data = pre + fmt(target * e) + post;
        if (k < 1) requestAnimationFrame(tick); else node.data = pre + raw + post;
      })(t0);
    }

    var pars = [];
    function scan(root) {
      if (!root.querySelectorAll) return;
      root.querySelectorAll('.rv, .rv-line, .fx-count').forEach(function (el) {
        if (el.__fxo) return; el.__fxo = true;
        if (io && !reduce) io.observe(el); else { el.classList.add('fx-in'); }
      });
      root.querySelectorAll('.fx-par').forEach(function (el) { if (!el.__fxp) { el.__fxp = true; pars.push(el); } });
    }
    scan(document);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n.parentNode || n); }); });
      pars = pars.filter(function (el) { return el.isConnected; });
    }).observe(document.body, { childList: true, subtree: true });

    // scroll: progreso, header, parallax
    var ticking = false;
    function onScroll() {
      ticking = false;
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      doc.style.setProperty('--fx-p', h > 0 ? (y / h).toFixed(4) : 0);
      doc.style.setProperty('--fx-sy', y);
      var hd = document.querySelector('header');
      if (hd) hd.classList.toggle('fx-scrolled', y > 12);
      if (reduce) return;
      var vh = window.innerHeight;
      pars.forEach(function (el) {
        var r = el.parentNode.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.translate = '0 ' + (c * -6).toFixed(2) + '%';
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    setInterval(req, 500); // el contenido se monta de forma asíncrona
    req();

    // brillo que sigue al cursor sobre superficies .fx-spot
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.fx-spot'); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });
})();
