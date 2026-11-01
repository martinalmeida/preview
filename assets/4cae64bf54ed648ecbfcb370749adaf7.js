/* Vogelkop · motor de escenas de obra v2 — requiere window.THREE (r149) */
(function () {
  var VK = { version: 2 };
  var TAU = Math.PI * 2;

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- texturas procedurales ---------- */
  var TX = {};
  function ctex(T, key, size, draw, opts) {
    if (TX[key]) return TX[key];
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'); draw(g, size, rng(key.length * 9973 + size));
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping;
    if (!(opts && opts.linear)) t.encoding = T.sRGBEncoding;
    t.anisotropy = 8; TX[key] = t; return t;
  }
  function speck(g, s, r, n, cols, a, sz) { for (var i = 0; i < n; i++) { g.globalAlpha = a * (0.4 + r() * 0.6); g.fillStyle = cols[(r() * cols.length) | 0]; var q = (sz || 1.5) * (0.5 + r()); g.fillRect(r() * s, r() * s, q, q); } g.globalAlpha = 1; }
  function blotch(g, s, r, n, col, a) { for (var i = 0; i < n; i++) { var x = r() * s, y = r() * s, rad = s * (0.05 + r() * 0.18); var gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = a * r(); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); } g.globalAlpha = 1; }
  var DRAW = {
    concrete: function (g, s, r) { g.fillStyle = '#b3ada4'; g.fillRect(0, 0, s, s); blotch(g, s, r, 40, '#8f897f', 0.35); blotch(g, s, r, 30, '#cfc9bf', 0.35); speck(g, s, r, 9000, ['#9a948b', '#c8c2b8', '#a7a196'], 0.5); g.strokeStyle = 'rgba(80,74,66,.25)'; g.lineWidth = 2; for (var y = s / 2; y <= s; y += s / 2) { g.beginPath(); g.moveTo(0, y - 1); g.lineTo(s, y - 1); g.stroke(); } for (var i = 0; i < 6; i++) { g.fillStyle = 'rgba(70,64,58,.35)'; g.beginPath(); g.arc(r() * s, r() * s, 2.5, 0, TAU); g.fill(); } },
    plaster: function (g, s, r) { g.fillStyle = '#eeeae3'; g.fillRect(0, 0, s, s); blotch(g, s, r, 20, '#e6e1d9', 0.25); speck(g, s, r, 7000, ['#e3ded6', '#f6f3ee', '#dcd6cc'], 0.45, 1.2); },
    brick: function (g, s, r) {
      g.fillStyle = '#b5a998'; g.fillRect(0, 0, s, s);
      var rows = 12, cols = 4, bh = s / rows, bw = s / cols, pal = ['#a4513a', '#b05f40', '#9a4733', '#b6694a', '#a15739', '#ad5a3a', '#8f4431'];
      for (var y = 0; y < rows; y++) for (var x = -1; x < cols; x++) {
        var ox = (y % 2) * bw / 2, X = x * bw + ox + 2, Y = y * bh + 2;
        g.fillStyle = pal[(r() * pal.length) | 0]; g.fillRect(X, Y, bw - 4, bh - 4);
        g.globalAlpha = 0.25; g.fillStyle = r() > 0.5 ? '#6e2f20' : '#d08a64'; g.fillRect(X + r() * bw * 0.5, Y, bw * 0.3, bh - 4); g.globalAlpha = 1;
      }
      speck(g, s, r, 6000, ['#5e2a1d', '#c98a68', '#7b3826'], 0.35);
    },
    wood: function (g, s, r) { g.fillStyle = '#9a6842'; g.fillRect(0, 0, s, s); for (var i = 0; i < 160; i++) { var x = r() * s; g.strokeStyle = r() > 0.5 ? 'rgba(70,40,20,.35)' : 'rgba(200,150,100,.25)'; g.lineWidth = 0.6 + r() * 1.6; g.beginPath(); for (var y = 0; y <= s; y += 8) g.lineTo(x + Math.sin(y * 0.02 + i) * 3, y); g.stroke(); } },
    cladding: function (g, s, r) { var n = 8, w = s / n; for (var i = 0; i < n; i++) { var v = 34 + ((r() * 10) | 0); g.fillStyle = 'rgb(' + v + ',' + (v - 3) + ',' + (v - 5) + ')'; g.fillRect(i * w, 0, w, s); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(i * w, 0, 2, s); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(i * w + 2, 0, 2, s); } speck(g, s, r, 3000, ['#1a1817', '#3d3936'], 0.4); },
    grass: function (g, s, r) { g.fillStyle = '#7b8858'; g.fillRect(0, 0, s, s); blotch(g, s, r, 90, '#6f7c4d', 0.22); blotch(g, s, r, 70, '#8e9a64', 0.2); var cols = ['#6c7a4b', '#8b9866', '#9aa770', '#5d6a42', '#a3ac78']; for (var i = 0; i < 26000; i++) { g.strokeStyle = cols[(r() * cols.length) | 0]; g.globalAlpha = 0.6; var x = r() * s, y = r() * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 2, y - 2 - r() * 4); g.stroke(); } g.globalAlpha = 1; },
    paving: function (g, s, r) { g.fillStyle = '#b3aa9c'; g.fillRect(0, 0, s, s); var n = 4, w = s / n; for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { var v = 206 + ((r() * 18) | 0); g.fillStyle = 'rgb(' + v + ',' + (v - 6) + ',' + (v - 15) + ')'; g.fillRect(x * w + 2, y * w + 2, w - 4, w - 4); } speck(g, s, r, 5000, ['#a39a8c', '#e6e0d6'], 0.35); },
    dirt: function (g, s, r) { g.fillStyle = '#a3896a'; g.fillRect(0, 0, s, s); blotch(g, s, r, 60, '#8c7254', 0.45); blotch(g, s, r, 40, '#b99e7d', 0.4); speck(g, s, r, 14000, ['#7e6448', '#c2a988', '#93785b', '#6f5a43'], 0.6, 2); for (var i = 0; i < 300; i++) { g.fillStyle = r() > 0.5 ? '#c8bba8' : '#6e6253'; g.beginPath(); g.arc(r() * s, r() * s, 1 + r() * 2.5, 0, TAU); g.fill(); } },
    asphalt: function (g, s, r) { g.fillStyle = '#4b4a48'; g.fillRect(0, 0, s, s); speck(g, s, r, 16000, ['#3b3a38', '#5d5b58', '#6b6965'], 0.6); },
    roof: function (g, s, r) { g.fillStyle = '#2a2928'; g.fillRect(0, 0, s, s); var n = 8, w = s / n; for (var i = 0; i < n; i++) { g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(i * w, 0, 3, s); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(i * w + 3, 0, 2, s); } speck(g, s, r, 2000, ['#1d1c1b', '#3a3836'], 0.3); },
    tile: function (g, s, r) { g.fillStyle = '#9fd0d0'; g.fillRect(0, 0, s, s); var n = 8, w = s / n; g.strokeStyle = '#d9eeee'; g.lineWidth = 2; for (var i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * w, 0); g.lineTo(i * w, s); g.stroke(); g.beginPath(); g.moveTo(0, i * w); g.lineTo(s, i * w); g.stroke(); } },
    leaf: function (g, s, r) { g.fillStyle = '#6d7d50'; g.fillRect(0, 0, s, s); var cols = ['#4f5f38', '#5d6d42', '#7e8e5c', '#93a26c', '#3f4d2c', '#a6b37b']; for (var i = 0; i < 9000; i++) { g.fillStyle = cols[(r() * cols.length) | 0]; g.globalAlpha = 0.7; g.beginPath(); g.ellipse(r() * s, r() * s, 1.5 + r() * 3, 1 + r() * 2, r() * 3, 0, TAU); g.fill(); } g.globalAlpha = 1; },
    room: function (g, s, r) {
      var gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, '#9a7a58'); gr.addColorStop(0.45, '#5a4632'); gr.addColorStop(1, '#2a221b'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
      for (var i = 0; i < 4; i++) { var x = (0.12 + r() * 0.76) * s, y = s * 0.12; var rg = g.createRadialGradient(x, y, 0, x, y, s * 0.35); rg.addColorStop(0, 'rgba(255,236,200,.95)'); rg.addColorStop(1, 'rgba(255,200,140,0)'); g.fillStyle = rg; g.fillRect(0, 0, s, s); }
      for (var k = 0; k < 5; k++) { g.fillStyle = 'rgba(20,16,12,' + (0.5 + r() * 0.4) + ')'; var w = s * (0.08 + r() * 0.2), h = s * (0.15 + r() * 0.3); g.fillRect(r() * (s - w), s - h, w, h); }
      g.fillStyle = 'rgba(240,230,215,.25)'; g.fillRect(0, 0, s * 0.06, s); g.fillRect(s * 0.94, 0, s * 0.06, s);
    },
    floor: function (g, s, r) { var n = 6, w = s / n; for (var i = 0; i < n; i++) { var v = 168 + ((r() * 22) | 0); g.fillStyle = 'rgb(' + v + ',' + (v - 28) + ',' + (v - 58) + ')'; g.fillRect(0, i * w, s, w); g.fillStyle = 'rgba(60,35,15,.4)'; g.fillRect(0, i * w, s, 1.5); } for (var k = 0; k < 120; k++) { g.strokeStyle = 'rgba(80,50,25,.18)'; g.beginPath(); var y = r() * s; g.moveTo(0, y); g.lineTo(s, y + (r() - 0.5) * 6); g.stroke(); } }
  };
  function alphaTex(T, key, size, draw) {
    if (TX[key]) return TX[key];
    var c = document.createElement('canvas'); c.width = c.height = size; var g = c.getContext('2d'); draw(g, size);
    var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; TX[key] = t; return t;
  }

  /* ---------- materiales ---------- */
  var MM = null;
  function M(T) {
    if (MM) return MM;
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    function tex(name, opts) { return ctex(T, name, name === 'grass' ? 1024 : (opts && opts.size || 512), DRAW[name]); }
    function std(o) { return new T.MeshStandardMaterial(Object.assign({ roughness: 0.9, metalness: 0 }, o)); }
    function tiled(name, tile, o) { var t = tex(name); var m = std(Object.assign({ map: t }, o)); m.userData.tile = tile; return m; }
    MM = {
      concrete: tiled('concrete', 2.4, { bumpMap: tex('concrete'), bumpScale: 0.015 }),
      plaster: tiled('plaster', 3, { color: 0xffffff, roughness: 0.95 }),
      brick: tiled('brick', 1.0, { bumpMap: tex('brick'), bumpScale: 0.02, roughness: 0.95 }),
      wood: tiled('wood', 1.2, { roughness: 0.75 }),
      cladding: tiled('cladding', 1.6, { roughness: 0.7 }),
      grass: tiled('grass', 7, { roughness: 1 }),
      paving: tiled('paving', 2.4, { bumpMap: tex('paving'), bumpScale: 0.01 }),
      dirt: tiled('dirt', 4, { bumpMap: tex('dirt'), bumpScale: 0.02, roughness: 1 }),
      asphalt: tiled('asphalt', 4, { roughness: 0.95 }),
      roof: tiled('roof', 2.4, { roughness: 0.55, metalness: 0.3 }),
      poolTile: tiled('tile', 1.2, { roughness: 0.3 }),
      floor: tiled('floor', 2.0, { roughness: 0.6 }),
      glass: new T.MeshPhysicalMaterial({ color: 0x0f1416, roughness: 0.06, metalness: 0.0, transparent: true, opacity: 0.38, envMapIntensity: 1.0, clearcoat: 0.6, clearcoatRoughness: 0.05 }),
      rail: new T.MeshPhysicalMaterial({ color: 0xd6e2e2, roughness: 0.05, transparent: true, opacity: 0.28, envMapIntensity: 1.4 }),
      water: new T.MeshPhysicalMaterial({ color: 0x2a6f78, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.9, envMapIntensity: 0.7, clearcoat: 0.5 }),
      interior: std({ color: 0x8a8580, map: ctex(T, 'room', 256, DRAW.room), emissive: 0xffd2a0, emissiveMap: ctex(T, 'room', 256, DRAW.room), emissiveIntensity: 0, roughness: 1 }),
      frame: std({ color: 0x1e1f20, roughness: 0.45, metalness: 0.6 }),
      orange: std({ color: 0xe8800a, roughness: 0.55 }),
      steel: std({ color: 0x8b8e92, roughness: 0.45, metalness: 0.7 }),
      darkSteel: std({ color: 0x3a3c3e, roughness: 0.5, metalness: 0.6 }),
      trunk: std({ color: 0x5d4a3a, roughness: 1 }),
      sand: std({ color: 0xc9b089, roughness: 1 }),
      pallet: std({ color: 0x9c7a55, roughness: 1 }),
      white: std({ color: 0xf2efea, roughness: 0.8 }),
      skin: std({ color: 0xb98a6a, roughness: 0.8 }),
      marker: new T.MeshBasicMaterial({ color: 0xf29200, transparent: true, opacity: 0.95, depthWrite: false }),
      markerIn: new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false }),
      net: new T.MeshStandardMaterial({ color: 0x2b2f2c, transparent: true, opacity: 0.45, alphaMap: alphaTex(T, 'net', 128, function (g, s) { g.fillStyle = '#000'; g.fillRect(0, 0, s, s); g.strokeStyle = '#999'; g.lineWidth = 2; for (var i = 0; i <= s; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, s); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(s, i); g.stroke(); } }), side: T.DoubleSide, depthWrite: false, roughness: 1 }),
      lattice: new T.MeshStandardMaterial({ color: 0xf29200, roughness: 0.5, metalness: 0.2, alphaMap: alphaTex(T, 'lattice', 128, function (g, s) { g.fillStyle = '#000'; g.fillRect(0, 0, s, s); g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(0, 0, s, s); g.lineWidth = 7; g.beginPath(); g.moveTo(0, s); g.lineTo(s, 0); g.stroke(); }), alphaTest: 0.5, side: T.DoubleSide }),
      ao: new T.MeshBasicMaterial({ color: 0x000000, transparent: true, depthWrite: false, opacity: 0.55, alphaMap: alphaTex(T, 'ao', 256, function (g, s) { g.fillStyle = '#000'; g.fillRect(0, 0, s, s); g.filter = 'blur(' + (s * 0.08) + 'px)'; g.fillStyle = '#fff'; g.fillRect(s * 0.16, s * 0.16, s * 0.68, s * 0.68); }) })
    };
    MM.net.alphaMap.repeat.set(30, 30); MM.lattice.alphaMap.repeat.set(1, 12);
    var lt = ctex(T, 'leaf', 512, DRAW.leaf); MM.leaves = [0xffffff, 0xe4ecd2, 0xd2dcc0, 0xf2f0dc, 0xc6d2b4].map(function (c) { return std({ color: c, map: lt, bumpMap: lt, bumpScale: 0.06, roughness: 0.95 }); });
    MM.cloth = [0x2f3a4a, 0xd9cfbf, 0x3b3b3b, 0xf0ece4, 0x6b5a48, 0x8b3a2b, 0x55637a].map(function (c) { return std({ color: c, roughness: 0.9 }); });
    MM.cars = [0xe8e6e1, 0x2c2e30, 0x8f969b, 0x5b2a24].map(function (c) { return new T.MeshPhysicalMaterial({ color: c, roughness: 0.3, metalness: 0.5, clearcoat: 1, clearcoatRoughness: 0.1 }); });
    return MM;
  }

  /* ---------- geometría base ---------- */
  function boxUV(geo, w, h, d, tile) {
    var uv = geo.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (var f = 0; f < 6; f++) for (var k = 0; k < 4; k++) { var i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile); }
    uv.needsUpdate = true;
  }
  function box(T, g, w, h, d, x, y, z, m, o) {
    var geo = new T.BoxGeometry(w, h, d);
    if (m.userData && m.userData.tile) boxUV(geo, w, h, d, m.userData.tile);
    var me = new T.Mesh(geo, m); me.position.set(x, y + h / 2, z);
    me.castShadow = !(o && o.noCast); me.receiveShadow = true; g.add(me); return me;
  }
  function plane(T, g, w, d, x, y, z, m, o) {
    var geo = new T.PlaneGeometry(w, d);
    if (m.userData && m.userData.tile) { var uv = geo.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / m.userData.tile, uv.getY(i) * d / m.userData.tile); }
    var me = new T.Mesh(geo, m); me.rotation.x = -Math.PI / 2; me.position.set(x, y, z); me.receiveShadow = true;
    if (o && o.ry) me.rotation.z = o.ry; g.add(me); return me;
  }
  function aoDecal(T, g, x, z, w, d, op) { var p = plane(T, g, w, d, x, 0.015, z, MM.ao); p.receiveShadow = false; if (op) { p.material = MM.ao.clone(); p.material.opacity = op; } p.renderOrder = 1; }

  /* ---------- fachada con vanos, marcos e interior ---------- */
  function facade(T, g, f, side, ratio, stage, opts) {
    opts = opts || {};
    var t = 0.25, y0 = f.y, h = f.h - 0.3;
    var x0 = f.x - f.w / 2, x1 = f.x + f.w / 2, z0 = f.z - f.d / 2, z1 = f.z + f.d / 2;
    var L = (side === 'S' || side === 'N') ? f.w : f.d;
    var bays = Math.max(1, Math.round(L / (opts.bay || 3.6))), b = L / bays;
    var wallM = stage >= 4 ? (opts.dark ? MM.cladding : MM.plaster) : MM.brick;
    function seg(u0, u1, ya, yb, m, depth, thick) {
      if (u1 - u0 < 0.01 || yb - ya < 0.01) return null;
      var len = u1 - u0, cu = (u0 + u1) / 2, th = thick || t, off = depth != null ? depth : t / 2;
      if (side === 'S') return box(T, g, len, yb - ya, th, x0 + cu, y0 + ya, z1 - off, m);
      if (side === 'N') return box(T, g, len, yb - ya, th, x0 + cu, y0 + ya, z0 + off, m);
      if (side === 'E') return box(T, g, th, yb - ya, len, x1 - off, y0 + ya, z0 + cu, m);
      return box(T, g, th, yb - ya, len, x0 + off, y0 + ya, z0 + cu, m);
    }
    function inner(u0, u1, ya, yb) {
      var len = u1 - u0, cu = (u0 + u1) / 2, hh = yb - ya, m = new T.Mesh(new T.PlaneGeometry(len, hh), MM.interior), yy = y0 + ya + hh / 2;
      if (side === 'S') m.position.set(x0 + cu, yy, z1 - 0.9);
      else if (side === 'N') { m.position.set(x0 + cu, yy, z0 + 0.9); m.rotation.y = Math.PI; }
      else if (side === 'E') { m.position.set(x1 - 0.9, yy, z0 + cu); m.rotation.y = Math.PI / 2; }
      else { m.position.set(x0 + 0.9, yy, z0 + cu); m.rotation.y = -Math.PI / 2; }
      g.add(m);
    }
    for (var i = 0; i < bays; i++) {
      var u = i * b, ww = b * ratio, p = (b - ww) / 2;
      if (ratio <= 0) { seg(u, u + b, 0, h, wallM); continue; }
      var sill = ratio >= 0.7 ? 0 : 0.9, head = ratio >= 0.7 ? h : h - 0.5;
      seg(u, u + p, 0, h, wallM); seg(u + b - p, u + b, 0, h, wallM);
      seg(u + p, u + b - p, 0, sill, wallM); seg(u + p, u + b - p, head, h, wallM);
      if (stage >= 4) {
        var a = u + p, c = u + b - p;
        var gl = seg(a, c, sill, head, MM.glass, 0.12, 0.03); if (gl) gl.castShadow = false;
        inner(a, c, sill, head);
        var fw = 0.05;
        seg(a, a + fw, sill, head, MM.frame, 0.1, 0.08); seg(c - fw, c, sill, head, MM.frame, 0.1, 0.08);
        seg(a, c, head - fw, head, MM.frame, 0.1, 0.08); seg(a, c, sill, sill + fw, MM.frame, 0.1, 0.08);
        if (c - a > 1.8) { var nm = Math.round((c - a) / 1.5); for (var k = 1; k < nm; k++) { var mx = a + (c - a) * k / nm; seg(mx - 0.025, mx + 0.025, sill, head, MM.frame, 0.1, 0.06); } }
        if (sill > 0) seg(a - 0.05, c + 0.05, sill - 0.04, sill, MM.white, -0.04, 0.12);
      } else if (stage === 3 && sill > 0) seg(u + p - 0.1, u + b - p + 0.1, sill - 0.05, sill, MM.concrete, 0.12, 0.25);
    }
  }
  function gridPts(f, spacing, fn) {
    var nx = Math.max(1, Math.round(f.w / spacing)), nz = Math.max(1, Math.round(f.d / spacing));
    for (var i = 0; i <= nx; i++) for (var j = 0; j <= nz; j++) fn(f.x - f.w / 2 + 0.3 + (f.w - 0.6) * i / nx, f.z - f.d / 2 + 0.3 + (f.d - 0.6) * j / nz, i === 0 || j === 0 || i === nx || j === nz);
  }
  function columns(T, g, f, spacing) { gridPts(f, spacing || 4.5, function (x, z) { box(T, g, 0.35, f.h - 0.3, 0.35, x, f.y, z, MM.concrete); }); }
  function rebar(T, g, f, spacing, y, hgt) {
    gridPts(f, spacing || 4.5, function (x, z) { for (var k = 0; k < 4; k++) box(T, g, 0.03, hgt || 1.4, 0.03, x + (k % 2 ? 0.12 : -0.12), y, z + (k > 1 ? 0.12 : -0.12), MM.darkSteel, { noCast: true }); });
  }
  function shoring(T, g, f, spacing) {
    var geo = new T.CylinderGeometry(0.03, 0.03, 1, 6);
    gridPts({ x: f.x, z: f.z, w: f.w - 1, d: f.d - 1 }, spacing || 1.6, function (x, z) { var m = new T.Mesh(geo, MM.steel); m.scale.y = f.h - 0.3; m.position.set(x, f.y + (f.h - 0.3) / 2, z); g.add(m); });
  }
  function slab(T, g, f, m) { box(T, g, f.w + 0.2, 0.3, f.d + 0.2, f.x, f.y + f.h - 0.3, f.z, m || MM.concrete); }
  function parapet(T, g, f, m) {
    var y = f.y + f.h, w = f.w + 0.2, d = f.d + 0.2, t = 0.2, h = 0.7;
    box(T, g, w, h, t, f.x, y, f.z + d / 2 - t / 2, m); box(T, g, w, h, t, f.x, y, f.z - d / 2 + t / 2, m);
    box(T, g, t, h, d - 2 * t, f.x + w / 2 - t / 2, y, f.z, m); box(T, g, t, h, d - 2 * t, f.x - w / 2 + t / 2, y, f.z, m);
    if (m !== MM.brick) { box(T, g, w + 0.06, 0.05, 0.3, f.x, y + h, f.z + d / 2 - 0.1, MM.frame); box(T, g, w + 0.06, 0.05, 0.3, f.x, y + h, f.z - d / 2 + 0.1, MM.frame); }
  }

  /* ---------- entorno: árboles, personas, autos ---------- */
  function displace(geo, r, amt) { var p = geo.attributes.position, v = new THREE.Vector3(); for (var i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); var n = 1 + (Math.sin(v.x * 5.1 + r) * Math.cos(v.y * 4.7 + r * 2) * Math.sin(v.z * 5.3 + r) * 0.7 + Math.sin(v.x * 11.0 + v.z * 9.0 + r) * 0.3) * amt; p.setXYZ(i, v.x * n, v.y * n * 0.92, v.z * n); } geo.computeVertexNormals(); }
  function tree(T, g, x, z, s, seed, anim) {
    var r = rng(seed * 131 + 7); s = s || 1;
    var t = new T.Group(); t.position.set(x, 0, z); g.add(t);
    var trunkH = (2.4 + r() * 1.2) * s;
    var tr = new T.Mesh(new T.CylinderGeometry(0.1 * s, 0.17 * s, trunkH, 7), MM.trunk); tr.position.y = trunkH / 2; tr.rotation.z = (r() - 0.5) * 0.12; tr.castShadow = true; t.add(tr);
    var crown = new T.Group(); crown.position.y = trunkH; t.add(crown);
    var n = 8 + ((r() * 6) | 0), mat = MM.leaves[(r() * MM.leaves.length) | 0];
    for (var i = 0; i < n; i++) {
      var rad = (0.7 + r() * 0.7) * s, geo = new T.SphereGeometry(rad, 18, 12); displace(geo, r() * 10, 0.22);
      var m = new T.Mesh(geo, r() > 0.75 ? MM.leaves[(r() * MM.leaves.length) | 0] : mat);
      var a = r() * TAU, d = (0.2 + r() * 1.3) * s; m.position.set(Math.cos(a) * d, (r() * 1.9 + 0.5) * s, Math.sin(a) * d); m.rotation.set(r() * 3, r() * 3, 0); m.castShadow = true; m.receiveShadow = true; crown.add(m);
    }
    if (anim) anim.push(function (time) { crown.rotation.z = Math.sin(time * 0.0009 + seed) * 0.02; crown.rotation.x = Math.cos(time * 0.0007 + seed) * 0.015; });
    return t;
  }
  function shrub(T, g, x, z, s, seed) { var r = rng(seed); var geo = new T.SphereGeometry(0.6 * s, 14, 10); displace(geo, r() * 10, 0.2); var m = new T.Mesh(geo, MM.leaves[(r() * 5) | 0]); m.scale.y = 0.7; m.position.set(x, 0.35 * s, z); m.castShadow = m.receiveShadow = true; g.add(m); }
  function person(T, g, x, z, rotY, seed, worker, walk) {
    var r = rng(seed * 17 + 3), p = new T.Group(); p.position.set(x, 0, z); p.rotation.y = rotY || 0; g.add(p);
    var hs = 0.94 + r() * 0.12, top = MM.cloth[(r() * MM.cloth.length) | 0], bot = MM.cloth[(r() * 3) | 0];
    var legG = new T.CapsuleGeometry(0.075, 0.72, 3, 8);
    [-0.1, 0.1].forEach(function (lx, i) { var l = new T.Mesh(legG, worker ? MM.cloth[0] : bot); l.position.set(lx, 0.45, 0); if (walk) l.rotation.x = (i ? 1 : -1) * 0.32; l.castShadow = true; p.add(l); });
    var body = new T.Mesh(new T.CapsuleGeometry(0.17, 0.42, 3, 10), worker ? MM.orange : top); body.position.y = 1.15; body.scale.z = 0.7; body.castShadow = true; p.add(body);
    [-0.23, 0.23].forEach(function (ax, i) { var a = new T.Mesh(new T.CapsuleGeometry(0.05, 0.5, 3, 6), worker ? MM.orange : top); a.position.set(ax, 1.12, 0); a.rotation.z = (i ? -1 : 1) * 0.08; if (walk) a.rotation.x = (i ? -1 : 1) * 0.3; a.castShadow = true; p.add(a); });
    var head = new T.Mesh(new T.SphereGeometry(0.105, 14, 12), MM.skin); head.position.y = 1.58; head.castShadow = true; p.add(head);
    if (worker) { var hat = new T.Mesh(new T.SphereGeometry(0.125, 14, 8, 0, TAU, 0, Math.PI / 2), MM.white); hat.position.y = 1.61; p.add(hat); }
    p.scale.setScalar(hs); return p;
  }
  function car(T, g, x, z, rotY, seed) {
    var r = rng(seed), c = new T.Group(); c.position.set(x, 0, z); c.rotation.y = rotY || 0; g.add(c);
    var mat = MM.cars[(r() * MM.cars.length) | 0];
    var body = new T.Mesh(new T.BoxGeometry(4.3, 0.7, 1.8), mat); body.position.y = 0.6; body.castShadow = true; c.add(body);
    var cab = new T.Mesh(new T.BoxGeometry(2.3, 0.62, 1.62), mat); cab.position.set(-0.2, 1.22, 0); cab.castShadow = true; c.add(cab);
    var win = new T.Mesh(new T.BoxGeometry(2.32, 0.5, 1.64), MM.glass); win.position.set(-0.2, 1.24, 0); c.add(win);
    var wg = new T.CylinderGeometry(0.34, 0.34, 0.25, 16); wg.rotateX(Math.PI / 2);
    [[1.35, 0.85], [1.35, -0.85], [-1.35, 0.85], [-1.35, -0.85]].forEach(function (w) { var m = new T.Mesh(wg, MM.darkSteel); m.position.set(w[0], 0.34, w[1]); c.add(m); });
    aoDecal(T, g, x, z, rotY ? 2.6 : 5.4, rotY ? 5.4 : 2.6, 0.5);
  }
  function scaffold(T, g, b, top, withNet) {
    var pg = new T.CylinderGeometry(0.025, 0.025, 1, 6), x0 = b.x0 - 1.1, x1 = b.x1 + 1.1, z0 = b.z0 - 1.1, z1 = b.z1 + 1.1;
    var sides = [[x0, z1, x1, z1], [x1, z1, x1, z0], [x1, z0, x0, z0], [x0, z0, x0, z1]];
    sides.forEach(function (s, si) {
      var len = Math.hypot(s[2] - s[0], s[3] - s[1]), n = Math.max(1, Math.round(len / 2.2)), ang = -Math.atan2(s[3] - s[1], s[2] - s[0]);
      for (var i = 0; i < n; i++) { var m = new T.Mesh(pg, MM.steel); m.scale.y = top; m.position.set(s[0] + (s[2] - s[0]) * i / n, top / 2, s[1] + (s[3] - s[1]) * i / n); g.add(m); }
      for (var y = 2; y < top; y += 2) {
        var rl = new T.Mesh(new T.BoxGeometry(len, 0.04, 0.04), MM.steel); rl.position.set((s[0] + s[2]) / 2, y + 1, (s[1] + s[3]) / 2); rl.rotation.y = ang; g.add(rl);
        var pl = new T.Mesh(new T.BoxGeometry(len, 0.05, 0.6), MM.wood); pl.position.set((s[0] + s[2]) / 2, y, (s[1] + s[3]) / 2); pl.rotation.y = ang; pl.translateZ(0.35); pl.castShadow = true; pl.receiveShadow = true; g.add(pl);
      }
      if (withNet && si % 2 === 1) { var net = new T.Mesh(new T.PlaneGeometry(len, top), MM.net); net.position.set((s[0] + s[2]) / 2, top / 2, (s[1] + s[3]) / 2); net.rotation.y = ang; net.translateZ(-0.05); g.add(net); }
    });
  }
  function crane(T, g, x, z, H, jib, anim) {
    var mast = new T.Mesh(new T.BoxGeometry(1.6, H, 1.6), MM.lattice); mast.position.set(x, H / 2, z); mast.material.alphaMap.repeat.set(1, H / 1.6); mast.castShadow = true; g.add(mast);
    var head = new T.Group(); head.position.set(x, H, z); g.add(head);
    var jm = MM.lattice.clone(); jm.alphaMap = MM.lattice.alphaMap.clone(); jm.alphaMap.needsUpdate = true; jm.alphaMap.repeat.set(jib / 1.2, 1);
    var j = new T.Mesh(new T.BoxGeometry(jib, 1.2, 1.2), jm); j.position.set(-jib / 2 + 6, 0.6, 0); j.castShadow = true; head.add(j);
    var cw = new T.Mesh(new T.BoxGeometry(3, 2, 2.2), MM.concrete); cw.position.set(7, -0.6, 0); head.add(cw);
    var cab = new T.Mesh(new T.BoxGeometry(2, 2.2, 2), MM.white); cab.position.set(0, 1.4, 1.5); head.add(cab);
    var cable = new T.Mesh(new T.BoxGeometry(0.03, H - 10, 0.03), MM.darkSteel); cable.position.set(-jib * 0.55, -(H - 10) / 2, 0); head.add(cable);
    var hook = new T.Mesh(new T.BoxGeometry(1.2, 0.6, 1.2), MM.pallet); hook.position.set(-jib * 0.55, -(H - 10), 0); head.add(hook);
    head.rotation.y = 0.4;
    if (anim) anim.push(function (time) { head.rotation.y = 0.4 + Math.sin(time * 0.00012) * 0.5; });
  }
  function stakes(T, g, b) {
    var pts = [[b.x0, b.z0], [b.x1, b.z0], [b.x1, b.z1], [b.x0, b.z1]];
    pts.forEach(function (p, i) {
      box(T, g, 0.06, 0.9, 0.06, p[0], 0, p[1], MM.wood);
      var q = pts[(i + 1) % 4], len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      var l = new T.Mesh(new T.BoxGeometry(len, 0.015, 0.015), MM.orange); l.position.set((p[0] + q[0]) / 2, 0.75, (p[1] + q[1]) / 2); l.rotation.y = -Math.atan2(q[1] - p[1], q[0] - p[0]); g.add(l);
    });
  }
  function sitePile(T, g, x, z, seed) {
    var r = rng(seed);
    var pile = new T.Mesh(new T.ConeGeometry(1.6, 1.1, 18), MM.sand); pile.position.set(x, 0.55, z); pile.scale.z = 0.8; pile.castShadow = pile.receiveShadow = true; g.add(pile);
    for (var i = 0; i < 2; i++) { box(T, g, 1.1, 0.12, 1.1, x + 2.6 + i * 1.4, 0, z, MM.pallet); box(T, g, 1.0, 0.8, 1.0, x + 2.6 + i * 1.4, 0.12, z, MM.brick); }
    var mix = new T.Mesh(new T.CylinderGeometry(0.45, 0.6, 1.1, 14), MM.orange); mix.rotation.z = 0.9; mix.position.set(x - 2.4, 1.0, z + 0.6); mix.castShadow = true; g.add(mix);
    box(T, g, 0.8, 0.7, 0.6, x - 2.4, 0, z + 0.6, MM.darkSteel);
  }
  function gable(T, g, cx, cy, cz, width, length, rise, axis, m, glassEnd) {
    var s = new T.Shape(); s.moveTo(-width / 2 - 0.5, 0); s.lineTo(width / 2 + 0.5, 0); s.lineTo(0, rise); s.lineTo(-width / 2 - 0.5, 0);
    var geo = new T.ExtrudeGeometry(s, { depth: length + 1, bevelEnabled: false }); geo.translate(0, 0, -(length + 1) / 2);
    if (m.userData.tile) { var uv = geo.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / m.userData.tile, uv.getY(i) / m.userData.tile); }
    var me = new T.Mesh(geo, m); me.castShadow = me.receiveShadow = true; me.position.set(cx, cy, cz); if (axis === 'x') me.rotation.y = Math.PI / 2; g.add(me);
    if (glassEnd) {
      var s2 = new T.Shape(); s2.moveTo(-width / 2 + 0.2, 0); s2.lineTo(width / 2 - 0.2, 0); s2.lineTo(0, rise - 0.5); s2.lineTo(-width / 2 + 0.2, 0);
      var gl = new T.Mesh(new T.ShapeGeometry(s2), MM.glass), inn = new T.Mesh(new T.ShapeGeometry(s2), MM.interior);
      if (axis === 'x') { gl.rotation.y = inn.rotation.y = Math.PI / 2; gl.position.set(cx + length / 2 + 0.55, cy, cz); inn.position.set(cx + length / 2 - 0.4, cy, cz); }
      else { gl.position.set(cx, cy, cz + length / 2 + 0.55); inn.position.set(cx, cy, cz + length / 2 - 0.4); }
      g.add(gl); g.add(inn);
    }
  }
  function bounds(floors) {
    var b = { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9, top: 0 };
    floors.forEach(function (f) { b.x0 = Math.min(b.x0, f.x - f.w / 2); b.x1 = Math.max(b.x1, f.x + f.w / 2); b.z0 = Math.min(b.z0, f.z - f.d / 2); b.z1 = Math.max(b.z1, f.z + f.d / 2); b.top = Math.max(b.top, f.y + f.h); });
    return b;
  }
  function floorsGeneric(T, g, floors, stage) {
    floors.forEach(function (f, i) {
      if (stage === 1 && (i === 0 || f.base)) { box(T, g, f.w + 0.4, 0.35, f.d + 0.4, f.x, 0, f.z, MM.concrete); rebar(T, g, f, f.col, 0.35, 1.4); }
      if (stage >= 2) {
        if (i === 0 || f.base) box(T, g, f.w + 0.4, f.y, f.d + 0.4, f.x, 0, f.z, MM.concrete);
        columns(T, g, f, f.col); slab(T, g, f);
        if (stage === 2 && f.top) { shoring(T, g, f); rebar(T, g, f, f.col, f.y + f.h, 1.2); }
        if (stage >= 3) box(T, g, f.w - 0.5, 0.06, f.d - 0.5, f.x, f.y, f.z, stage >= 4 ? MM.floor : MM.concrete, { noCast: true });
      }
      if (stage >= 3) {
        ['S', 'N', 'E', 'W'].forEach(function (sd) { if (f.r[sd] != null) facade(T, g, f, sd, f.r[sd], stage, { dark: f.dark, bay: f.bay }); });
        if (f.roof) parapet(T, g, f, stage >= 4 ? (f.dark ? MM.cladding : MM.plaster) : MM.brick);
      }
    });
  }

  /* ---------- obras ---------- */
  var PRESETS = {
    casa: {
      name: 'Casa Ríos',
      floors: [
        { x: 0, z: 0, w: 14, d: 9, y: 0.3, h: 3.4, r: { S: 0.85, N: 0.3, E: 0.3, W: 0.25 }, col: 4.6 },
        { x: 2.5, z: -0.5, w: 16, d: 7, y: 3.7, h: 3.2, r: { S: 0.55, N: 0.3, E: 0.7, W: 0 }, col: 4.6, roof: true, top: true }
      ],
      extra: function (T, g, stage, A, floors) {
        plane(T, g, 60, 7, 0, 0.02, 22, MM.asphalt); plane(T, g, 60, 2.2, 0, 0.03, 17.6, MM.paving);
        if (stage >= 4) {
          plane(T, g, 34, 30, 0, 0.012, 0, MM.grass);
          box(T, g, 12.4, 0.16, 5.4, -1.5, 0, 7.6, MM.paving, { noCast: true });
          box(T, g, 11, 0.02, 4, -1.5, 0.14, 7.6, MM.poolTile, { noCast: true });
          var w = plane(T, g, 11, 4, -1.5, 0.15, 7.6, MM.water); w.renderOrder = 2;
          box(T, g, 15, 0.1, 1.6, -1.5, 0, 4.9, MM.wood, { noCast: true });
          plane(T, g, 3, 12, -9.5, 0.02, 11, MM.paving);
          box(T, g, 1.2, 2.5, 0.12, -5.6, 0.3, 4.58, MM.orange);
          for (var i = 0; i < 26; i++) box(T, g, 0.07, 2.7, 0.16, 4.2 + i * 0.3, 3.95, 3.2, MM.wood);
          box(T, g, 16.6, 0.25, 8, 2.5, 6.6, -0.5, MM.frame, { noCast: true });
          [[-13, 1.5, 1.2], [-11, -6, 1.1], [13.5, 8, 1.15], [14.5, -5, 1], [-3, -11, 1.3], [8, -11.5, 1.1], [-13.5, 13, 0.9]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 1, A); });
          for (var s = 0; s < 9; s++) shrub(T, g, -6 + s * 1.6, -5.6, 0.9, s + 40);
          person(T, g, 3.6, 6.2, -0.4, 3); person(T, g, 4.4, 6.0, -2.4, 9); person(T, g, -9.4, 9, 0.2, 21, false, true);
        } else {
          [[-12, -6, 1.1], [14.5, -5, 1], [-3, -12, 1.3]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 2, A); });
          if (stage >= 1) sitePile(T, g, 12, 10, 4);
          if (stage >= 1) { person(T, g, 8, 7, 1.2, 11, true); person(T, g, -6, 6.5, -0.6, 12, true, true); }
          if (stage >= 2) { person(T, g, 2, 4.2, 0.3, 14, true); }
          if (stage >= 3) person(T, g, -3, 5, 2.4, 15, true);
          car(T, g, 9, 21, 0, 8);
        }
      },
      lot: [34, 30],
      stations: [
        { name: 'Acceso principal', pos: [-3, 17], look: [0, 3, 0] },
        { name: 'Terraza y piscina', pos: [6, 10], look: [-2, 2, 0] },
        { name: 'Sala · interior', pos: [-3, 0.5], look: [0, 1.7, 10], y: 0.3 },
        { name: 'Jardín oriental', pos: [17, 4], look: [2, 3, 0] },
        { name: 'Patio posterior', pos: [-1, -14], look: [1, 3, 0] }
      ]
    },
    edificio: {
      name: 'Torre Altamira',
      floors: (function () {
        var a = [{ x: 0, z: 0, w: 18, d: 14, y: 0.3, h: 4.2, r: { S: 0.85, N: 0.4, E: 0.5, W: 0.5 }, col: 4.5 }];
        for (var i = 1; i < 8; i++) a.push({ x: 0, z: 0, w: 18, d: 14, y: 4.5 + (i - 1) * 3, h: 3, r: { S: 0.6, N: 0.45, E: 0.35, W: 0.35 }, col: 4.5, roof: i === 7, top: i === 7 });
        return a;
      })(),
      extra: function (T, g, stage, A, floors) {
        plane(T, g, 90, 9, 0, 0.02, 15.5, MM.asphalt); plane(T, g, 90, 3, 0, 0.03, 10, MM.paving);
        if (stage >= 2) for (var i = 1; i < 8; i++) {
          var f = floors[i], x = i % 2 ? -3 : 3;
          box(T, g, 9, 0.25, 1.8, x, f.y - 0.25, 7.9, MM.concrete);
          if (stage >= 4) { box(T, g, 9, 1.05, 0.04, x, f.y, 8.78, MM.rail, { noCast: true }); box(T, g, 9, 0.05, 0.06, x, f.y + 1.05, 8.78, MM.frame); }
        }
        if (stage === 2 || stage === 3) crane(T, g, 15, -5, 38, 34, A);
        if (stage >= 4) {
          box(T, g, 6, 0.3, 3, 0, 3.6, 8.5, MM.orange);
          box(T, g, 6, 2.6, 4, 2, 25.8, -2, MM.plaster);
          [[-14, 9, 1.3], [14, 10, 1.1], [-15, -8, 1.2], [15, -9, 1.2], [-8, 11.5, 0.9], [8, 11.5, 0.9]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 30, A); });
          person(T, g, -1, 10, 0.2, 31, false, true); person(T, g, 1.2, 9.6, 3, 32); person(T, g, 6, 10.4, -1.3, 33, false, true); person(T, g, -6.5, 9.8, 1.2, 34);
          car(T, g, -10, 14, 0, 6); car(T, g, 12, 17, Math.PI, 7);
        } else {
          [[-15, -8, 1.2], [15, -12, 1.2]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 36, A); });
          if (stage >= 1) { sitePile(T, g, -16, 4, 9); person(T, g, -12, 6, 0.6, 41, true); person(T, g, 10, 9, 2.2, 42, true, true); }
          if (stage >= 2) { person(T, g, 3, 8.6, 0, 43, true); person(T, g, -4, 8.4, 2.8, 44, true); }
          car(T, g, -14, 14, 0, 9);
        }
      },
      lot: [42, 34],
      stations: [
        { name: 'Calle principal', pos: [-6, 24], look: [0, 10, 0] },
        { name: 'Lobby · interior', pos: [-4, 3], look: [6, 2, -4], y: 0.3 },
        { name: 'Esquina oriental', pos: [22, 18], look: [0, 10, 0] },
        { name: 'Patio de maniobras', pos: [20, -16], look: [0, 8, 0] }
      ]
    },
    pabellon: {
      name: 'Oficinas Mirador',
      floors: [
        { x: 0, z: 0, w: 30, d: 16, y: 0.3, h: 4.2, r: { S: 0.92, N: 0.92, E: 0.92, W: 0.92 }, col: 6, bay: 3 },
        { x: 0, z: 0, w: 30, d: 16, y: 4.5, h: 4.0, r: { S: 0.92, N: 0.92, E: 0.92, W: 0.92 }, col: 6, bay: 3, top: true }
      ],
      extra: function (T, g, stage, A) {
        if (stage >= 2) {
          box(T, g, 38, 0.5, 24, 0, 8.5, 0, stage >= 4 ? MM.plaster : MM.concrete);
          [[-18.5, -11.5], [18.5, -11.5], [-18.5, 11.5], [18.5, 11.5], [0, 11.5], [0, -11.5]].forEach(function (p) { box(T, g, 0.3, 8.2, 0.3, p[0], 0.3, p[1], MM.frame); });
        }
        if (stage >= 4) {
          for (var i = 0; i < 18; i++) box(T, g, 0.8, 7.6, 0.1, 15.7, 0.6, -7.5 + i * 0.88, MM.orange);
          plane(T, g, 52, 40, 0, 0.012, 2, MM.paving);
          for (var k = 0; k < 4; k++) box(T, g, 4, 0.45, 4, -18 + k * 12, 0, 17, MM.concrete);
          [[-18, 17, 1.1], [-6, 17, 1.2], [6, 17, 1], [18, 17, 1.15], [-26, -6, 1.2], [26, -10, 1.3]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 50, A); });
          person(T, g, -6, 13, 0.2, 51, false, true); person(T, g, -4.6, 13.4, 2.8, 52); person(T, g, 8, 14, -0.9, 53, false, true); person(T, g, 2, 12.6, 1.6, 54);
          car(T, g, -22, 24, 0, 2);
        }
      },
      lot: [52, 40],
      stations: [{ name: 'Plaza de acceso', pos: [-8, 24], look: [0, 4, 0] }, { name: 'Esquina norte', pos: [26, 18], look: [0, 4, 0] }]
    },
    campestre: {
      name: 'Casa Bruma',
      floors: [
        { x: -3, z: 0, w: 22, d: 7, y: 0.3, h: 3.4, r: { S: 0.75, N: 0.3, E: null, W: 0.2 }, col: 4.4, dark: true, top: true },
        { x: 10.5, z: 4, w: 7, d: 18, y: 0.3, h: 3.4, r: { S: 0.85, N: 0.2, E: 0.6, W: 0.4 }, col: 4.4, dark: true, top: true }
      ],
      extra: function (T, g, stage, A) {
        if (stage >= 3) {
          var rm = stage >= 4 ? MM.roof : MM.concrete;
          gable(T, g, -3.5, 3.7, 0, 7, 21, 3.4, 'x', rm, false);
          gable(T, g, 10.5, 3.7, 4, 7, 18, 3.4, 'z', rm, stage >= 4);
        }
        if (stage >= 4) {
          plane(T, g, 70, 60, 0, 0.012, 0, MM.grass);
          box(T, g, 1.1, 2.5, 0.12, -12, 0.3, 3.58, MM.orange);
          box(T, g, 18, 0.14, 3.6, -4, 0, 5.4, MM.wood, { noCast: true });
          plane(T, g, 3.2, 26, -16, 0.02, 16, MM.paving);
          [[-19, 8, 1.4], [-18, -7, 1.3], [3, 11, 1.1], [21, 6, 1.4], [20, -14, 1.1], [-6, -9, 1.3], [3, -16, 1.1], [-24, -2, 1.5], [24, 18, 1.2], [-8, 20, 1.3]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 60, A); });
          person(T, g, -2, 5.8, 0.6, 61); person(T, g, -1, 6.1, -2.2, 62); person(T, g, -16, 12, 0.1, 63, false, true);
          car(T, g, -16, 22, Math.PI / 2, 3);
        } else {
          [[-19, 8, 1.4], [-18, -7, 1.3], [20, -14, 1.1], [-24, -2, 1.5]].forEach(function (t, k) { tree(T, g, t[0], t[1], t[2], k + 64, A); });
          if (stage >= 1) { sitePile(T, g, -14, 10, 6); person(T, g, 4, 6, 0.4, 66, true); }
        }
      },
      lot: [46, 38],
      stations: [
        { name: 'Llegada', pos: [-6, 18], look: [0, 3, 0] },
        { name: 'Deck', pos: [-2, 6.2], look: [-10, 2, 6], y: 0.14 },
        { name: 'Sala de doble altura', pos: [10.5, 2], look: [10.5, 3, 14], y: 0.3 },
        { name: 'Bosque', pos: [22, -2], look: [8, 3, -4] }
      ]
    }
  };
  VK.presets = PRESETS;
  VK.stageNames = ['Lote', 'Cimentación', 'Estructura', 'Obra gris', 'Terminado'];

  /* ---------- cielo, luz y hora del día ---------- */
  var TIMES = {
    day: { top: 0x7fa2c0, hor: 0xf3ebdf, bot: 0xe8dfd1, sun: [-32, 46, 26], sunC: 0xfff3e2, sunI: 2.6, hemi: 0.4, exp: 0.95, fog: 0xeee6da, glow: 0, env: 1 },
    dusk: { top: 0x3e4f66, hor: 0xf4b27a, bot: 0x6e6158, sun: [-70, 10, 30], sunC: 0xffb47a, sunI: 1.6, hemi: 0.28, exp: 1.1, fog: 0xd8b494, glow: 2.4, env: 0.7 }
  };
  VK.times = TIMES;
  function skyMesh(T, tm) {
    var mat = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color(tm.top) }, hor: { value: new T.Color(tm.hor) }, bot: { value: new T.Color(tm.bot) }, sunDir: { value: new T.Vector3().fromArray(tm.sun).normalize() }, sunC: { value: new T.Color(tm.sunC) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 hor; uniform vec3 bot; uniform vec3 sunDir; uniform vec3 sunC; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h,0.0,1.0), 0.42)) : mix(hor, bot, clamp(-h*4.0,0.0,1.0)); float s = max(dot(normalize(vP), normalize(sunDir)), 0.0); c += sunC * (pow(s, 600.0) * 4.0 + pow(s, 12.0) * 0.25); gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
    });
    var m = new T.Mesh(new T.SphereGeometry(500, 32, 16), mat); m.frustumCulled = false; m.renderOrder = -1; return m;
  }
  var ENV = {};
  function envFor(T, renderer, time) {
    var key = time; if (ENV[key]) return ENV[key];
    var s = new T.Scene(); s.add(skyMesh(T, TIMES[time]));
    var gnd = new T.Mesh(new T.CircleGeometry(400, 24), new T.MeshBasicMaterial({ color: TIMES[time].bot })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = -1; s.add(gnd);
    var pm = new T.PMREMGenerator(renderer); ENV[key] = pm.fromScene(s, 0.02).texture; pm.dispose(); return ENV[key];
  }
  function applyTime(T, renderer, scene, time) {
    var tm = TIMES[time], u = scene.userData;
    u.sky.material.uniforms.top.value.set(tm.top); u.sky.material.uniforms.hor.value.set(tm.hor); u.sky.material.uniforms.bot.value.set(tm.bot);
    u.sky.material.uniforms.sunDir.value.fromArray(tm.sun).normalize(); u.sky.material.uniforms.sunC.value.set(tm.sunC);
    u.sun.position.fromArray(tm.sun); u.sun.color.set(tm.sunC); u.sun.intensity = tm.sunI; u.hemi.intensity = tm.hemi;
    scene.fog.color.set(tm.fog); scene.environment = envFor(T, renderer, time);
    MM.interior.emissiveIntensity = tm.glow; MM.glass.envMapIntensity = 0.9 * tm.env + 0.2;
    u.lamps.forEach(function (l) { l.visible = tm.glow > 0; });
    u.time = time;
  }

  VK.buildScene = function (T, renderer, preset, stage, time) {
    var P = PRESETS[preset]; M(T);
    var scene = new T.Scene(), A = [];
    scene.fog = new T.Fog(0xece4d8, 60, 260);
    var sky = skyMesh(T, TIMES.day); scene.add(sky);
    var hemi = new T.HemisphereLight(0xffffff, 0xb9ae9c, 0.35); scene.add(hemi);
    var sun = new T.DirectionalLight(0xfff1de, 2.6); sun.castShadow = true;
    var b = bounds(P.floors), R = Math.max(b.x1 - b.x0, b.z1 - b.z0, b.top) * 0.5 + 22;
    sun.shadow.mapSize.set(2048, 2048); var sc = sun.shadow.camera; sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.near = 1; sc.far = 300;
    sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.025; sun.target.position.set((b.x0 + b.x1) / 2, 0, (b.z0 + b.z1) / 2); scene.add(sun.target);
    scene.add(sun);
    var ground = plane(T, scene, 900, 900, 0, 0, 0, MM.grass); ground.material = MM.grass;
    if (stage < 4) plane(T, scene, P.lot[0], P.lot[1], 0, 0.01, 0, MM.dirt);
    var g = new T.Group(); scene.add(g);
    if (stage === 0) stakes(T, g, b);
    floorsGeneric(T, g, P.floors, stage);
    P.extra(T, g, stage, A, P.floors);
    if (stage === 2 || stage === 3) scaffold(T, g, b, b.top + 1, true);
    if (stage >= 1) aoDecal(T, g, (b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2, b.x1 - b.x0 + 6, b.z1 - b.z0 + 6, 0.45);
    var lamps = [];
    if (stage >= 4) P.floors.forEach(function (f) { var l = new T.PointLight(0xffc98a, 0.9, 14, 2); l.position.set(f.x, f.y + f.h * 0.6, f.z); l.visible = false; scene.add(l); lamps.push(l); });
    scene.userData = { sky: sky, sun: sun, hemi: hemi, anim: A, lamps: lamps, bounds: b, preset: preset, stage: stage };
    applyTime(T, renderer, scene, time || 'day');
    return scene;
  };

  /* ---------- visor: recorrido (walk) u órbita (orbit) ---------- */
  VK.Viewer = function (T, canvas, opts) {
    opts = opts || {}; M(T);
    var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.preserve });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxPR || 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    var mode = opts.mode || 'walk';
    var cam = new T.PerspectiveCamera(mode === 'walk' ? 70 : 32, 1, 0.1, 1200); cam.rotation.order = 'YXZ';
    var cache = {}, preset = opts.preset || 'casa', stage = opts.stage == null ? 4 : opts.stage, before = opts.before || 0, time = opts.time || 'day';
    var compare = false, split = 0.5, station = 0, yaw = 0, pitch = 0, vy = 0, vp = 0, anim = null, raf = 0, alive = true, ready = false;
    var orbit = { az: opts.az != null ? opts.az : -0.7, el: opts.el != null ? opts.el : 0.2, r: 50, target: new T.Vector3(), auto: opts.autoRotate !== false };
    var lastInput = performance.now(), ray = new T.Raycaster(), hover = null;
    var seq = opts.sequence ? { list: opts.sequence, i: 0, t0: performance.now(), hold: opts.hold || 2600, on: true } : null;
    var rtA = null, rtB = null, quad = null, qcam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), fade = null;
    function makeRT() {
      var s = renderer.getDrawingBufferSize(new T.Vector2());
      var o = { type: T.HalfFloatType, samples: renderer.capabilities.isWebGL2 ? 4 : 0 };
      if (!rtA) { rtA = new T.WebGLRenderTarget(s.x, s.y, o); rtB = new T.WebGLRenderTarget(s.x, s.y, o); } else { rtA.setSize(s.x, s.y); rtB.setSize(s.x, s.y); }
      if (!quad) {
        var mat = new T.ShaderMaterial({
          uniforms: { tA: { value: null }, tB: { value: null }, mixT: { value: 0 }, split: { value: 0.5 }, mode: { value: 0 } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
          fragmentShader: 'uniform sampler2D tA; uniform sampler2D tB; uniform float mixT; uniform float split; uniform float mode; varying vec2 vUv; void main(){ vec4 a = texture2D(tA, vUv); vec4 b = texture2D(tB, vUv); float k = mode < 0.5 ? smoothstep(0.0,1.0,mixT) : step(split, vUv.x); gl_FragColor = mix(a, b, k);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}',
          depthTest: false, depthWrite: false
        });
        quad = new T.Mesh(new T.PlaneGeometry(2, 2), mat); quad.frustumCulled = false;
      }
    }
    function scene(st, pr) {
      pr = pr || preset; var k = pr + ':' + st;
      if (!cache[k]) {
        var s = VK.buildScene(T, renderer, pr, st, time);
        if (mode === 'walk') PRESETS[pr].stations.forEach(function (sta, i) {
          var gp = new T.Group(); gp.position.set(sta.pos[0], (sta.y || 0) + 0.05, sta.pos[1]); gp.userData.station = i; s.add(gp);
          var m = new T.Mesh(new T.RingGeometry(0.42, 0.62, 48), MM.marker); m.rotation.x = -Math.PI / 2; m.userData.station = i; m.renderOrder = 3; gp.add(m);
          var d = new T.Mesh(new T.CircleGeometry(0.18, 32), MM.markerIn); d.rotation.x = -Math.PI / 2; d.position.y = 0.01; d.userData.station = i; d.renderOrder = 3; gp.add(d);
          var hit = new T.Mesh(new T.CircleGeometry(0.9, 16), new T.MeshBasicMaterial({ visible: false })); hit.rotation.x = -Math.PI / 2; hit.userData.station = i; gp.add(hit);
          s.userData.anim.push(function (tm) { var k2 = 1 + Math.sin(tm * 0.004 + i) * 0.08 + (hover === i ? 0.3 : 0); gp.scale.setScalar(k2); gp.visible = i !== station || mode !== 'walk'; });
        });
        cache[k] = s;
      } else if (cache[k].userData.time !== time) applyTime(T, renderer, cache[k], time);
      return cache[k];
    }
    function eye(i) { var s = PRESETS[preset].stations[i]; return new T.Vector3(s.pos[0], (s.y || 0) + 1.65, s.pos[1]); }
    function faceAngles(i) { var s = PRESETS[preset].stations[i], e = eye(i), dx = s.look[0] - e.x, dz = s.look[2] - e.z, dy = s.look[1] - e.y; return [Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz)) * 0.6]; }
    function fitOrbit() { var b = scene(stage).userData.bounds; orbit.target.set((b.x0 + b.x1) / 2, b.top * 0.35, (b.z0 + b.z1) / 2); orbit.r = Math.max(b.x1 - b.x0, b.z1 - b.z0, b.top * 1.3) * (opts.dist || 1.9); }
    function resize() {
      var w = canvas.clientWidth || 800, h = canvas.clientHeight || 500;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); if (rtA) makeRT();
    }
    function snapshot() { makeRT(); renderer.setRenderTarget(rtA); renderer.render(currentScene(), cam); renderer.setRenderTarget(null); fade = { t0: performance.now(), dur: opts.fadeMs || 750 }; }
    function currentScene() { return scene(stage); }
    function frame(now) {
      if (!alive) return; raf = requestAnimationFrame(frame);
      var idle = now - lastInput > 7000;
      if (mode === 'walk') {
        if (anim) {
          var t = Math.min(1, (now - anim.t0) / anim.dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          cam.position.lerpVectors(anim.from, anim.to, e); cam.position.y += Math.sin(e * Math.PI) * 0.35;
          yaw = anim.y0 + (anim.y1 - anim.y0) * e; pitch = anim.p0 + (anim.p1 - anim.p0) * e;
          cam.fov = 70 + Math.sin(e * Math.PI) * 6; cam.updateProjectionMatrix();
          if (t >= 1) anim = null;
        } else if (!down) { yaw += vy; pitch = Math.max(-1.2, Math.min(1.2, pitch + vp)); vy *= 0.92; vp *= 0.92; if (idle && opts.drift !== false) yaw += 0.0004; }
        cam.rotation.y = yaw; cam.rotation.x = pitch;
      } else {
        if (!down) { orbit.az += vy; orbit.el = Math.max(0.03, Math.min(1.2, orbit.el + vp)); vy *= 0.93; vp *= 0.93; if (orbit.auto && (idle || !opts.pauseOnInput)) orbit.az += 0.0009; }
        var ce = Math.cos(orbit.el);
        cam.position.set(orbit.target.x + Math.sin(orbit.az) * ce * orbit.r, orbit.target.y + Math.sin(orbit.el) * orbit.r, orbit.target.z + Math.cos(orbit.az) * ce * orbit.r);
        cam.lookAt(orbit.target);
      }
      if (seq && !seq.on && idle && opts.sequenceResume) { seq.on = true; seq.t0 = now; }
      if (seq && seq.on && !fade && now - seq.t0 > seq.hold * (seq.list[seq.i] === 4 ? 1.8 : 1)) { seq.i = (seq.i + 1) % seq.list.length; seq.t0 = now; setStageInt(seq.list[seq.i]); }
      var sc = currentScene(); sc.userData.anim.forEach(function (f) { f(now); });
      if (compare || fade) {
        makeRT();
        if (compare) { var sb = scene(before); sb.userData.anim.forEach(function (f) { f(now); }); renderer.setRenderTarget(rtA); renderer.render(sb, cam); }
        renderer.setRenderTarget(rtB); renderer.render(sc, cam); renderer.setRenderTarget(null);
        quad.material.uniforms.tA.value = rtA.texture; quad.material.uniforms.tB.value = rtB.texture;
        quad.material.uniforms.mode.value = compare ? 1 : 0; quad.material.uniforms.split.value = split;
        if (fade && !compare) { var k = (now - fade.t0) / fade.dur; quad.material.uniforms.mixT.value = Math.min(1, k); if (k >= 1) fade = null; } else fade = null;
        renderer.render(quad, qcam);
      } else renderer.render(sc, cam);
      if (!ready) { ready = true; if (opts.onReady) setTimeout(opts.onReady, 0); }
    }
    function go(i, instant) {
      var s = PRESETS[preset].stations[i]; station = i; vy = vp = 0;
      var to = eye(i), fa = faceAngles(i), y1 = fa[0];
      while (y1 - yaw > Math.PI) y1 -= TAU; while (y1 - yaw < -Math.PI) y1 += TAU;
      if (instant) { cam.position.copy(to); yaw = y1; pitch = fa[1]; }
      else anim = { t0: performance.now(), dur: 1300, from: cam.position.clone(), to: to, y0: yaw, y1: y1, p0: pitch, p1: fa[1] };
      if (opts.onStation) opts.onStation(i, s.name);
    }
    function setStageInt(s) { if (s === stage) return; snapshot(); stage = s; if (opts.onStage) opts.onStage(s); }
    var down = null;
    function pick(e) {
      var r = canvas.getBoundingClientRect(), v = new T.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(v, cam);
      var hits = ray.intersectObjects(currentScene().children, true).filter(function (h) { return h.object.userData.station != null; });
      return hits.length ? hits[0].object.userData.station : null;
    }
    function pd(e) { lastInput = performance.now(); down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: false }; vy = vp = 0; canvas.style.cursor = 'grabbing'; if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId); if (seq) seq.on = false; }
    function pm(e) {
      if (!down) {
        if (mode === 'walk') { var h = pick(e); if (h !== hover) { hover = h; canvas.style.cursor = h != null ? 'pointer' : 'grab'; if (opts.onHover) { var r = canvas.getBoundingClientRect(); opts.onHover(h != null ? PRESETS[preset].stations[h].name : null, e.clientX - r.left, e.clientY - r.top); } } }
        return;
      }
      lastInput = performance.now();
      var dx = e.clientX - down.lx, dy = e.clientY - down.ly; down.lx = e.clientX; down.ly = e.clientY;
      if (Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y) > 4) down.moved = true;
      if (mode === 'walk') { var k = cam.fov / 70 * 0.0042; vy = dx * k; vp = dy * k; yaw += vy; pitch = Math.max(-1.2, Math.min(1.2, pitch + vp)); anim = null; }
      else { vy = -dx * 0.005; vp = dy * 0.004; orbit.az += vy; orbit.el = Math.max(0.03, Math.min(1.2, orbit.el + vp)); }
    }
    function pu(e) { canvas.style.cursor = 'grab'; if (down && !down.moved && mode === 'walk') { var h = pick(e); if (h != null) go(h); } down = null; }
    function wh(e) { e.preventDefault(); lastInput = performance.now(); if (mode === 'walk') { cam.fov = Math.max(35, Math.min(90, cam.fov + e.deltaY * 0.03)); cam.updateProjectionMatrix(); } else orbit.r = Math.max(15, Math.min(220, orbit.r * (1 + e.deltaY * 0.001))); }
    canvas.addEventListener('pointerdown', pd); canvas.addEventListener('pointermove', pm); canvas.addEventListener('pointerup', pu); canvas.addEventListener('pointerleave', function () { if (opts.onHover) opts.onHover(null); hover = null; });
    canvas.addEventListener('wheel', wh, { passive: false });
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null; if (ro) ro.observe(canvas); else window.addEventListener('resize', resize);
    resize(); if (mode === 'walk') go(0, true); else fitOrbit(); raf = requestAnimationFrame(frame);

    this.setPreset = function (p, st, bf) { if (ready) snapshot(); preset = p; if (st != null) stage = st; if (bf != null) before = bf; cam.fov = mode === 'walk' ? 70 : 32; cam.updateProjectionMatrix(); if (mode === 'walk') go(0, true); else fitOrbit(); };
    this.setStage = function (s) { if (seq) seq.on = false; setStageInt(s); };
    this.setBefore = function (s) { before = s; };
    this.setCompare = function (on) { compare = !!on; };
    this.setSplit = function (x) { split = Math.max(0.02, Math.min(0.98, x)); };
    this.setTime = function (t) { if (t === time || !TIMES[t]) return; if (ready) snapshot(); time = t; Object.keys(cache).forEach(function (k) { applyTime(T, renderer, cache[k], t); }); renderer.toneMappingExposure = TIMES[t].exp; };
    this.goTo = function (i) { lastInput = performance.now(); go(i); };
    this.turn = function (d) { lastInput = performance.now(); if (mode === 'walk') { vy = d * 0.06; } else vy = -d * 0.04; };
    this.zoom = function (d) { lastInput = performance.now(); if (mode === 'walk') { cam.fov = Math.max(35, Math.min(90, cam.fov + d)); cam.updateProjectionMatrix(); } else orbit.r = Math.max(15, Math.min(220, orbit.r * (1 + d * 0.03))); };
    this.play = function (on) { if (seq) { seq.on = on !== false; seq.t0 = performance.now(); } };
    this.stations = function () { return PRESETS[preset].stations.map(function (s) { return s.name; }); };
    this.dispose = function () {
      alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect();
      canvas.removeEventListener('pointerdown', pd); canvas.removeEventListener('pointermove', pm); canvas.removeEventListener('pointerup', pu); canvas.removeEventListener('wheel', wh);
      if (rtA) { rtA.dispose(); rtB.dispose(); } renderer.dispose();
    };
    this.renderer = renderer; this.camera = cam;
  };
  VK.Tour = function (T, canvas, opts) { return new VK.Viewer(T, canvas, Object.assign({ mode: 'walk' }, opts)); };
  window.VKScene = VK;
})();
