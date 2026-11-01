/* @ds-bundle: {"format":4,"namespace":"Vogelkop","components":[{"name":"Icon"},{"name":"Button"},{"name":"TextField"},{"name":"Select"},{"name":"Checkbox"},{"name":"Badge"},{"name":"Alert"},{"name":"Tabs"},{"name":"PhaseTracker"},{"name":"Avatar"},{"name":"ProjectCard"},{"name":"SideNav"},{"name":"DataTable"}]} */
(function () {
  var React = window.React, h = React.createElement, useState = React.useState;
  var ICONS = {"layout-dashboard":[["rect",{"width":"7","height":"9","x":"3","y":"3","rx":"1"}],["rect",{"width":"7","height":"5","x":"14","y":"3","rx":"1"}],["rect",{"width":"7","height":"9","x":"14","y":"12","rx":"1"}],["rect",{"width":"7","height":"5","x":"3","y":"16","rx":"1"}]],"folder-kanban":[["path",{"d":"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"}],["path",{"d":"M8 10v4"}],["path",{"d":"M12 10v2"}],["path",{"d":"M16 10v6"}]],"building-2":[["path",{"d":"M10 12h4"}],["path",{"d":"M10 8h4"}],["path",{"d":"M14 21v-3a2 2 0 0 0-4 0v3"}],["path",{"d":"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"}],["path",{"d":"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"}]],"drafting-compass":[["path",{"d":"m12.99 6.74 1.93 3.44"}],["path",{"d":"M19.136 12a10 10 0 0 1-14.271 0"}],["path",{"d":"m21 21-2.16-3.84"}],["path",{"d":"m3 21 8.02-14.26"}],["circle",{"cx":"12","cy":"5","r":"2"}]],"ruler":[["path",{"d":"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"}],["path",{"d":"m14.5 12.5 2-2"}],["path",{"d":"m11.5 9.5 2-2"}],["path",{"d":"m8.5 6.5 2-2"}],["path",{"d":"m17.5 15.5 2-2"}]],"hard-hat":[["path",{"d":"M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"}],["path",{"d":"M14 6a6 6 0 0 1 6 6v3"}],["path",{"d":"M4 15v-3a6 6 0 0 1 6-6"}],["rect",{"x":"2","y":"15","width":"20","height":"4","rx":"1"}]],"file-text":[["path",{"d":"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{"d":"M10 9H8"}],["path",{"d":"M16 13H8"}],["path",{"d":"M16 17H8"}]],"image":[["rect",{"width":"18","height":"18","x":"3","y":"3","rx":"2","ry":"2"}],["circle",{"cx":"9","cy":"9","r":"2"}],["path",{"d":"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]],"calendar-days":[["path",{"d":"M8 2v3"}],["path",{"d":"M16 2v3"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2"}],["path",{"d":"M3 9h18"}],["path",{"d":"M8 13h.01"}],["path",{"d":"M12 13h.01"}],["path",{"d":"M16 13h.01"}],["path",{"d":"M8 17h.01"}],["path",{"d":"M12 17h.01"}],["path",{"d":"M16 17h.01"}]],"users":[["path",{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{"d":"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{"d":"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{"cx":"9","cy":"7","r":"4"}]],"message-square":[["path",{"d":"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"}]],"bell":[["path",{"d":"M10.268 21a2 2 0 0 0 3.464 0"}],["path",{"d":"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"}]],"search":[["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],"plus":[["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],"upload":[["path",{"d":"M12 3v12"}],["path",{"d":"m17 8-5-5-5 5"}],["path",{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}]],"download":[["path",{"d":"M12 15V3"}],["path",{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{"d":"m7 10 5 5 5-5"}]],"map-pin":[["path",{"d":"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"}],["circle",{"cx":"12","cy":"10","r":"3"}]],"layers":[["path",{"d":"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{"d":"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{"d":"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]],"clipboard-check":[["rect",{"width":"8","height":"4","x":"8","y":"2","rx":"1","ry":"1"}],["path",{"d":"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}],["path",{"d":"m9 14 2 2 4-4"}]],"receipt":[["path",{"d":"M12 17V7"}],["path",{"d":"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"}],["path",{"d":"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"}]],"wallet":[["path",{"d":"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"}],["path",{"d":"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"}]],"settings":[["path",{"d":"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{"cx":"12","cy":"12","r":"3"}]],"filter":[["path",{"d":"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"}]],"log-out":[["path",{"d":"m16 17 5-5-5-5"}],["path",{"d":"M21 12H9"}],["path",{"d":"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}]],"chevron-right":[["path",{"d":"m9 18 6-6-6-6"}]],"chevron-down":[["path",{"d":"m6 9 6 6 6-6"}]],"check":[["path",{"d":"M20 6 9 17l-5-5"}]],"x":[["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],"triangle-alert":[["path",{"d":"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{"d":"M12 9v4"}],["path",{"d":"M12 17h.01"}]],"circle-check":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"m16 9-5.5 5.5L8 12"}]],"info":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],"more-horizontal":[["circle",{"cx":"12","cy":"12","r":"1"}],["circle",{"cx":"19","cy":"12","r":"1"}],["circle",{"cx":"5","cy":"12","r":"1"}]],"arrow-right":[["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]]};
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function rest(props, keys) { var o = {}; for (var k in props) if (keys.indexOf(k) < 0) o[k] = props[k]; return o; }

  function Icon(p) {
    var size = p.size || 20, els = ICONS[p.name] || [];
    return h('svg', { className: cx('vk-icon', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p.strokeWidth || 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': p.label ? undefined : true, role: p.label ? 'img' : undefined, 'aria-label': p.label },
      els.map(function (e, i) { var a = {}; for (var k in e[1]) a[k.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })] = e[1][k]; a.key = i; return h(e[0], a); }));
  }

  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var r = rest(p, ['variant', 'size', 'icon', 'iconRight', 'className', 'children', 'block']);
    return h('button', Object.assign({ type: 'button' }, r, { className: cx('vk-btn', 'vk-btn--' + variant, 'vk-btn--' + size, p.block && 'vk-btn--block', !p.children && 'vk-btn--icononly', p.className) }),
      p.icon && h(Icon, { name: p.icon, size: size === 'sm' ? 16 : 18 }),
      p.children && h('span', null, p.children),
      p.iconRight && h(Icon, { name: p.iconRight, size: size === 'sm' ? 16 : 18 }));
  }

  var uid = 0; function useId(id) { var s = useState(function () { return id || 'vk-' + (++uid); }); return s[0]; }

  function Field(p, control) {
    return h('div', { className: cx('vk-field', p.error && 'is-error', p.disabled && 'is-disabled', p.className) },
      p.label && h('label', { className: 'vk-field__label', htmlFor: p.id }, p.label, p.required && h('span', { className: 'vk-field__req', 'aria-hidden': true }, ' *')),
      control,
      (p.error || p.hint) && h('div', { className: 'vk-field__msg', id: p.id + '-msg' }, p.error && h(Icon, { name: 'triangle-alert', size: 14 }), p.error || p.hint));
  }

  function TextField(p) {
    var id = useId(p.id);
    var r = rest(p, ['label', 'hint', 'error', 'icon', 'suffix', 'className', 'id', 'multiline']);
    var input = h(p.multiline ? 'textarea' : 'input', Object.assign({}, r, { id: id, className: 'vk-input__el', 'aria-invalid': !!p.error, 'aria-describedby': (p.error || p.hint) ? id + '-msg' : undefined }));
    return Field(Object.assign({}, p, { id: id }), h('div', { className: cx('vk-input', p.multiline && 'vk-input--multi') }, p.icon && h(Icon, { name: p.icon, size: 18 }), input, p.suffix && h('span', { className: 'vk-input__suffix' }, p.suffix)));
  }

  function Select(p) {
    var id = useId(p.id);
    var r = rest(p, ['label', 'hint', 'error', 'options', 'placeholder', 'className', 'id']);
    var opts = (p.options || []).map(function (o) { o = typeof o === 'string' ? { value: o, label: o } : o; return h('option', { key: o.value, value: o.value }, o.label); });
    if (p.placeholder) opts.unshift(h('option', { key: '__ph', value: '', disabled: true }, p.placeholder));
    return Field(Object.assign({}, p, { id: id }), h('div', { className: 'vk-input vk-select' },
      h('select', Object.assign({ defaultValue: p.value === undefined && p.placeholder ? '' : undefined }, r, { id: id, className: 'vk-input__el', 'aria-invalid': !!p.error }), opts),
      h(Icon, { name: 'chevron-down', size: 18, className: 'vk-select__chev' })));
  }

  function Checkbox(p) {
    var id = useId(p.id);
    var r = rest(p, ['label', 'description', 'className', 'id']);
    return h('label', { className: cx('vk-check', p.disabled && 'is-disabled', p.className), htmlFor: id },
      h('input', Object.assign({ type: 'checkbox' }, r, { id: id, className: 'vk-check__el' })),
      h('span', { className: 'vk-check__box', 'aria-hidden': true }, h(Icon, { name: 'check', size: 14, strokeWidth: 3 })),
      h('span', { className: 'vk-check__text' }, h('span', { className: 'vk-check__label' }, p.label), p.description && h('span', { className: 'vk-check__desc' }, p.description)));
  }

  var TONE_ICON = { success: 'circle-check', warning: 'triangle-alert', danger: 'triangle-alert', info: 'info' };
  function Badge(p) {
    var tone = p.tone || 'neutral';
    return h('span', { className: cx('vk-badge', 'vk-badge--' + tone, p.className) },
      p.dot !== false && tone !== 'neutral' && tone !== 'brand' ? h('span', { className: 'vk-badge__dot', 'aria-hidden': true }) : (p.icon ? h(Icon, { name: p.icon, size: 14 }) : null),
      p.children);
  }

  function Alert(p) {
    var tone = p.tone || 'info';
    return h('div', { className: cx('vk-alert', 'vk-alert--' + tone, p.className), role: tone === 'danger' ? 'alert' : 'status' },
      h(Icon, { name: TONE_ICON[tone], size: 20, className: 'vk-alert__icon' }),
      h('div', { className: 'vk-alert__body' }, p.title && h('div', { className: 'vk-alert__title' }, p.title), p.children && h('div', { className: 'vk-alert__text' }, p.children)),
      p.action && h('div', { className: 'vk-alert__action' }, p.action),
      p.onClose && h('button', { type: 'button', className: 'vk-alert__close', onClick: p.onClose, 'aria-label': 'Cerrar' }, h(Icon, { name: 'x', size: 18 })));
  }

  function Tabs(p) {
    var items = p.items || [];
    var s = useState(p.defaultValue || (items[0] && items[0].id));
    var value = p.value !== undefined ? p.value : s[0];
    function pick(id) { if (p.value === undefined) s[1](id); if (p.onChange) p.onChange(id); }
    return h('div', { className: cx('vk-tabs', p.className), role: 'tablist' }, items.map(function (it) {
      var on = it.id === value;
      return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': on, className: cx('vk-tab', on && 'is-active'), onClick: function () { pick(it.id); } },
        it.icon && h(Icon, { name: it.icon, size: 16 }), it.label, it.count != null && h('span', { className: 'vk-tab__count' }, it.count));
    }));
  }

  function PhaseTracker(p) {
    var phases = p.phases || [], cur = p.current || 0;
    return h('ol', { className: cx('vk-phases', p.className) }, phases.map(function (ph, i) {
      var state = i < cur ? 'done' : i === cur ? 'current' : 'todo';
      return h('li', { key: i, className: 'vk-phase is-' + state, 'aria-current': state === 'current' ? 'step' : undefined },
        h('div', { className: 'vk-phase__rail' }, h('span', { className: 'vk-phase__mark' }, state === 'done' ? h(Icon, { name: 'check', size: 14, strokeWidth: 3 }) : String(i + 1).padStart(2, '0'))),
        h('div', { className: 'vk-phase__label' }, ph.label),
        h('div', { className: 'vk-phase__meta' }, state === 'current' ? (ph.date ? 'En curso · ' + ph.date : 'En curso') : (ph.date || (state === 'done' ? 'Completada' : 'Pendiente'))));
    }));
  }

  function Avatar(p) {
    var size = p.size || 32;
    var initials = (p.name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    return h('span', { className: cx('vk-avatar', p.tone === 'brand' && 'vk-avatar--brand', p.className), style: { width: size, height: size, fontSize: Math.round(size * 0.36) }, title: p.name },
      p.src ? h('img', { src: p.src, alt: p.name || '' }) : initials);
  }

  function ProjectCard(p) {
    var r = rest(p, ['code', 'name', 'client', 'location', 'phase', 'status', 'progress', 'image', 'due', 'team', 'className']);
    var pct = Math.max(0, Math.min(100, p.progress || 0));
    return h('article', Object.assign({ tabIndex: p.onClick ? 0 : undefined }, r, { className: cx('vk-pcard', p.onClick && 'is-clickable', p.className) }),
      h('div', { className: 'vk-pcard__media' }, p.image ? h('img', { src: p.image, alt: '' }) : h(Icon, { name: 'drafting-compass', size: 40, strokeWidth: 1.25 }),
        p.status && h('div', { className: 'vk-pcard__status' }, h(Badge, { tone: p.status.tone }, p.status.label))),
      h('div', { className: 'vk-pcard__body' },
        h('div', { className: 'vk-pcard__code' }, p.code),
        h('h3', { className: 'vk-pcard__name' }, p.name),
        h('div', { className: 'vk-pcard__meta' }, p.client && h('span', null, h(Icon, { name: 'users', size: 14 }), p.client), p.location && h('span', null, h(Icon, { name: 'map-pin', size: 14 }), p.location)),
        h('div', { className: 'vk-pcard__progress' },
          h('div', { className: 'vk-pcard__row' }, h('span', null, p.phase), h('span', { className: 'vk-pcard__pct' }, pct + '%')),
          h('div', { className: 'vk-bar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('div', { className: 'vk-bar__fill', style: { width: pct + '%' } }))),
        h('div', { className: 'vk-pcard__foot' },
          h('div', { className: 'vk-pcard__team' }, (p.team || []).slice(0, 4).map(function (n, i) { return h(Avatar, { key: i, name: n, size: 28 }); })),
          p.due && h('span', { className: 'vk-pcard__due' }, h(Icon, { name: 'calendar-days', size: 14 }), p.due))));
  }

  function SideNav(p) {
    var items = p.items || [];
    var s = useState(p.defaultValue || (items[0] && items[0].id));
    var value = p.value !== undefined ? p.value : s[0];
    function pick(id) { if (p.value === undefined) s[1](id); if (p.onChange) p.onChange(id); }
    return h('nav', { className: cx('vk-nav', p.className), 'aria-label': 'Principal' },
      h('div', { className: 'vk-nav__brand' }, p.logo ? (typeof p.logo === 'string' ? h('img', { src: p.logo, alt: 'Vogelkop' }) : p.logo) : h('span', { className: 'vk-nav__word' }, 'VOGELKOP')),
      h('ul', { className: 'vk-nav__list' }, items.map(function (it) {
        if (it.section) return h('li', { key: it.section, className: 'vk-nav__section' }, it.section);
        var on = it.id === value;
        return h('li', { key: it.id }, h('button', { type: 'button', className: cx('vk-nav__item', on && 'is-active'), 'aria-current': on ? 'page' : undefined, onClick: function () { pick(it.id); } },
          it.icon && h(Icon, { name: it.icon, size: 20 }), h('span', { className: 'vk-nav__label' }, it.label), it.count != null && h('span', { className: 'vk-nav__count' }, it.count)));
      })),
      p.user && h('div', { className: 'vk-nav__user' }, h(Avatar, { name: p.user.name, size: 36, tone: 'brand' }), h('div', { className: 'vk-nav__who' }, h('div', { className: 'vk-nav__uname' }, p.user.name), h('div', { className: 'vk-nav__role' }, p.user.role))));
  }

  function DataTable(p) {
    var cols = p.columns || [], rows = p.rows || [];
    return h('div', { className: cx('vk-table-wrap', p.className) }, h('table', { className: 'vk-table' },
      p.caption && h('caption', null, p.caption),
      h('thead', null, h('tr', null, cols.map(function (c) { return h('th', { key: c.key, scope: 'col', className: cx(c.align === 'right' && 'is-right'), style: c.width ? { width: c.width } : null }, c.label); }))),
      h('tbody', null, rows.length ? rows.map(function (row, i) {
        return h('tr', { key: row.id || i, className: cx(p.onRowClick && 'is-clickable', p.selectedId != null && row.id === p.selectedId && 'is-selected'), onClick: p.onRowClick ? function () { p.onRowClick(row); } : undefined },
          cols.map(function (c) { var v = c.render ? c.render(row) : row[c.key]; return h('td', { key: c.key, className: cx(c.mono && 'is-mono', c.align === 'right' && 'is-right', c.muted && 'is-muted') }, v); }));
      }) : h('tr', null, h('td', { colSpan: cols.length, className: 'vk-table__empty' }, p.empty || 'Sin resultados')))));
  }

  var api = { Icon: Icon, Button: Button, TextField: TextField, Select: Select, Checkbox: Checkbox, Badge: Badge, Alert: Alert, Tabs: Tabs, PhaseTracker: PhaseTracker, Avatar: Avatar, ProjectCard: ProjectCard, SideNav: SideNav, DataTable: DataTable, icons: Object.keys(ICONS) };
  window.Vogelkop = Object.assign(window.Vogelkop || {}, api);
})();
