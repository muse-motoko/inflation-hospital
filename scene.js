// 見た目：病院の絵（SVG）とアニメーション。ゲームロジックは持たず、index.html から呼ばれるだけ
(function (root) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var SVG =
  '<svg id="sceneSvg" viewBox="0 0 400 260" xmlns="' + NS + '" role="img" aria-label="病院の病室">' +
  '<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9f1ec"/><stop offset="1" stop-color="#f1faf8"/></linearGradient></defs>' +
  // 壁・床
  '<rect width="400" height="260" fill="url(#wall)"/><rect y="215" width="400" height="45" fill="#bfe0da"/>' +
  '<rect y="213" width="400" height="4" fill="#9ccfc6"/>' +
  // 窓と雲
  '<g transform="translate(18,18)"><rect width="78" height="62" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="5"/><path d="M39 0v62M0 31h78" stroke="#fff" stroke-width="4"/><g class="cloud"><ellipse cx="24" cy="20" rx="12" ry="6" fill="#fff"/><ellipse cx="34" cy="17" rx="9" ry="6" fill="#fff"/></g></g>' +
  // 十字マーク
  '<g class="cross-sign" transform="translate(190,22)"><rect width="44" height="44" rx="10" fill="#e5484d"/><rect x="18" y="8" width="8" height="28" rx="2" fill="#fff"/><rect x="8" y="18" width="28" height="8" rx="2" fill="#fff"/></g>' +
  // 心電図モニター
  '<g transform="translate(284,18)"><rect width="100" height="70" rx="8" fill="#2c3e45"/><rect x="6" y="6" width="88" height="46" rx="4" fill="#0b1a1d"/>' +
  '<svg x="6" y="6" width="88" height="46" viewBox="0 0 88 46"><g class="ecg-move"><path id="ecgPath" d="M0 26H10L14 26L18 10L23 40L27 26H44L48 26L52 10L57 40L61 26H78L82 26L86 10L91 40L95 26H132L136 26L140 10L145 40L149 26H176" fill="none" stroke="#3dff9a" stroke-width="2" stroke-linejoin="round"/></g></svg>' +
  '<g id="heart" class="heart" transform="translate(14,61)"><path d="M0 -3c-3 -5 -9 -1 -5 4l5 5l5 -5c4 -5 -2 -9 -5 -4z" fill="#ff5a6a"/></g><circle cx="86" cy="60" r="4" fill="#3dff9a" class="blip"/></g>' +
  // ベッド
  '<g id="bed"><rect x="40" y="170" width="320" height="16" rx="6" fill="#8a6f5a"/><rect x="40" y="186" width="8" height="40" fill="#6f5846"/><rect x="352" y="186" width="8" height="40" fill="#6f5846"/><rect x="32" y="130" width="14" height="96" rx="5" fill="#a98a70"/></g>' +
  // 患者（巨大）
  '<g id="patient" class="p-breath p-happy0">' +
    '<rect x="60" y="128" width="285" height="48" rx="24" fill="#bfe3ff"/><rect x="60" y="128" width="285" height="48" rx="24" fill="none" stroke="#7fb8e6" stroke-width="3"/>' +
    '<path d="M150 130v46M230 130v46" stroke="#7fb8e6" stroke-width="2" stroke-dasharray="4 4"/>' +
    '<ellipse cx="82" cy="140" rx="48" ry="40" fill="#fff" stroke="#d5d5d5" stroke-width="3"/>' +
    '<circle cx="82" cy="108" r="42" fill="#ffd9b8" stroke="#e0b088" stroke-width="3"/>' +
    '<path d="M42 100c4-30 70-34 82 0c-20-12-60-12-82 0z" fill="#6b4a3a"/>' +
    '<g id="eyes"><g class="eye-open"><circle cx="66" cy="110" r="5" fill="#2b2b2b"/><circle cx="98" cy="110" r="5" fill="#2b2b2b"/></g><g class="eye-sleep" stroke="#2b2b2b" stroke-width="3" fill="none" stroke-linecap="round"><path d="M59 111q7 6 14 0"/><path d="M91 111q7 6 14 0"/></g><g class="eye-ouch" stroke="#2b2b2b" stroke-width="3" fill="none" stroke-linecap="round"><path d="M60 106l12 8M72 106l-12 8"/><path d="M92 106l12 8M104 106l-12 8"/></g></g>' +
    '<circle cx="54" cy="122" r="7" fill="#ff9fa8" opacity=".7"/><circle cx="110" cy="122" r="7" fill="#ff9fa8" opacity=".7"/>' +
    '<g id="mouth"><path class="m-sleep" d="M74 128q8 5 16 0" stroke="#a33" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse class="m-ouch" cx="82" cy="130" rx="7" ry="9" fill="#a33"/><path class="m-smile" d="M70 126q12 14 24 0" stroke="#a33" stroke-width="3" fill="#fff" stroke-linecap="round"/></g>' +
    '<g id="zzz" class="zzz"><text x="120" y="78" font-size="18" font-weight="bold" fill="#5b7a80">Z</text><text x="136" y="62" font-size="14" font-weight="bold" fill="#5b7a80">z</text></g>' +
    '<g id="bandage"><rect x="52" y="78" width="26" height="9" rx="3" fill="#fff" stroke="#e5484d" transform="rotate(-18 65 82)"/><path d="M62 81l6-3" stroke="#e5484d" stroke-width="2"/></g>' +
    '<g id="sweat" class="sweat"><path d="M120 94q-5 9 0 12q5-3 0-12z" fill="#6fc3ff"/></g>' +
  '</g>' +
  // 点滴スタンド
  '<g id="drip"><path d="M376 224V70" stroke="#9aa" stroke-width="4"/><path d="M366 70h20" stroke="#9aa" stroke-width="4"/><rect x="366" y="76" width="20" height="34" rx="6" fill="#d8f4ff" stroke="#6fb"/><rect x="368" y="92" width="16" height="16" rx="4" fill="#6fd0ff"/><circle class="drop" cx="376" cy="118" r="3" fill="#6fd0ff"/><path d="M376 112v56" stroke="#6fd0ff" stroke-width="1.5"/></g>' +
  // 医者（自分：左前、相手：右前）
  doctor('docMine', 20, '#1f9d8f', '#3b2a20') +
  doctor('docRival', 300, '#e08a1f', '#2a2a40') +
  // 効果用
  '<g id="fxLayer"></g>' +
  '</svg>';

  function doctor(id, x, cap, hair) {
    return '<g id="' + id + '" class="doc" transform="translate(' + x + ',112)">' +
      '<g class="doc-body">' +
      '<rect x="12" y="52" width="56" height="78" rx="14" fill="#fff" stroke="#cfe5e0" stroke-width="3"/>' +
      '<rect x="34" y="52" width="12" height="78" fill="#e8f6f3"/>' +
      '<g class="arm"><rect x="52" y="62" width="14" height="42" rx="7" fill="#fff" stroke="#cfe5e0" stroke-width="3" transform="rotate(-25 58 66)"/><circle cx="66" cy="102" r="7" fill="#ffd9b8"/>' +
      '<g class="tool"><rect x="64" y="92" width="26" height="6" rx="3" fill="#cfd8dc"/><rect x="88" y="90" width="4" height="10" fill="#e5484d"/><rect x="60" y="94" width="6" height="3" fill="#9aa"/></g></g>' +
      '<circle cx="40" cy="30" r="24" fill="#ffd9b8" stroke="#e0b088" stroke-width="3"/>' +
      '<path d="M16 26c2-22 46-22 48 0c-14-8-34-8-48 0z" fill="' + hair + '"/>' +
      '<rect x="14" y="8" width="52" height="12" rx="6" fill="' + cap + '"/><rect x="37" y="4" width="6" height="16" fill="#fff"/><rect x="32" y="9" width="16" height="6" fill="#fff"/>' +
      '<circle cx="31" cy="34" r="3" fill="#2b2b2b"/><circle cx="49" cy="34" r="3" fill="#2b2b2b"/>' +
      '<path d="M32 43q8 7 16 0" stroke="#a33" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M22 56q18 30 36 0" stroke="#555" stroke-width="3" fill="none"/><circle cx="40" cy="92" r="6" fill="#bbb" stroke="#777" stroke-width="2"/>' +
      '</g></g>';
  }

  var el = {}, hpRatio = 1, hitTimer = null;
  function $(id) { return document.getElementById(id); }

  function mount(host) {
    host.innerHTML = SVG;
    ['patient', 'docMine', 'docRival', 'fxLayer', 'sceneSvg'].forEach(function (k) { el[k] = $(k); });
    mood('sleep');
    setHp(1);
  }

  // 患者の表情：sleep（ぐっすり）/ ouch（いたい）/ smile（げんき）
  function mood(name) {
    el.patient.setAttribute('data-mood', name);
  }
  // HP の割合（0〜1）で表情・包帯・汗が変わる
  function setHp(ratio) {
    hpRatio = ratio;
    var s = ratio > 0.66 ? 'high' : (ratio > 0.33 ? 'mid' : 'low');
    el.patient.setAttribute('data-hp', s);
  }
  function add(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    (parent || el.fxLayer).appendChild(n);
    return n;
  }
  function later(n, ms) { setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, ms); }
  function restart(node, cls) {
    node.classList.remove(cls); void node.getBoundingClientRect(); node.classList.add(cls);
  }

  // 治療（kind: syringe / drip / steth）。医者が動き、患者に効果が出る
  var KINDS = ['syringe', 'drip', 'steth'];
  var seq = 0;
  function treat(who, text) {
    if (!el.patient) return;
    var doc = who === 'rival' ? el.docRival : el.docMine;
    restart(doc, 'act');
    var kind = KINDS[seq++ % KINDS.length];
    var x = who === 'rival' ? 280 : 130, y = 120;
    var g = add('g', { class: 'fx-' + kind, transform: 'translate(' + x + ',' + y + ')' });
    if (kind === 'syringe') {
      add('rect', { x: -4, y: -5, width: 34, height: 10, rx: 4, fill: '#fff', stroke: '#7a8' }, g);
      add('rect', { x: -14, y: -1, width: 12, height: 2, fill: '#999' }, g);
      add('rect', { x: 30, y: -7, width: 4, height: 14, fill: '#e5484d' }, g);
      for (var i = 0; i < 4; i++) add('circle', { class: 'spark', cx: -10 - i * 5, cy: (i % 2 ? 8 : -8), r: 3, fill: '#ffe066' }, g);
    } else if (kind === 'drip') {
      for (var j = 0; j < 5; j++) add('path', { class: 'dropfx', d: 'M0 -6q-5 9 0 12q5-3 0-12z', fill: '#6fd0ff', transform: 'translate(' + (j * 12 - 24) + ',' + (j % 2 * 6) + ')', style: 'animation-delay:' + j * 60 + 'ms' }, g);
    } else {
      for (var r = 1; r <= 3; r++) add('circle', { class: 'ring', cx: 10, cy: 0, r: r * 8, fill: 'none', stroke: '#e5484d', 'stroke-width': 3, style: 'animation-delay:' + r * 90 + 'ms' }, g);
      add('path', { d: 'M0 0q10 -14 20 0', stroke: '#e5484d', 'stroke-width': 3, fill: 'none' }, g);
    }
    later(g, 900);
    // 数字が飛ぶ
    if (text) {
      var t = add('text', { class: 'flynum', x: 70 + Math.random() * 180, y: 120, 'font-size': 22, 'font-weight': 900, 'text-anchor': 'middle', fill: who === 'rival' ? '#b0660f' : '#1a78a8', stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' });
      t.textContent = text;
      later(t, 1100);
    }
    // 患者が痛がる（いたい顔）→ 少し後に HP に応じた表情に戻る
    mood('ouch');
    restart(el.patient, 'hit');
    setTimeout(function () { el.patient.classList.remove('hit'); }, 400);
    clearTimeout(hitTimer);
    hitTimer = setTimeout(function () { mood(hpRatio > 0.66 ? 'sleep' : (hpRatio > 0.33 ? 'sleep' : 'smile')); }, 450);
  }

  // 患者を治した（ハート・星が舞う。患者は元気な顔）
  function cured() {
    if (!el.patient) return;
    mood('smile');
    for (var i = 0; i < 12; i++) {
      var h = add('text', { class: 'burst', x: 60 + i * 26, y: 110, 'font-size': 20, 'text-anchor': 'middle', style: 'animation-delay:' + (i * 40) + 'ms' });
      h.textContent = i % 3 === 0 ? '★' : '♥';
      h.setAttribute('fill', i % 3 === 0 ? '#ffc400' : '#ff5a6a');
      later(h, 1500);
    }
  }
  // 次の患者が運び込まれる
  function newPatient(n) {
    if (!el.patient) return;
    var hue = (n * 47) % 360;
    el.patient.style.setProperty('--gown', 'hsl(' + hue + ',70%,85%)');
    el.patient.style.setProperty('--size', String(Math.min(1.12, 1 + n * 0.02)));
    clearTimeout(hitTimer);
    mood('sleep'); setHp(1);
    restart(el.patient, 'enter');
    setTimeout(function () { el.patient.classList.remove('enter'); }, 1000);
  }
  function celebrate() { cured(); }

  root.Scene = { mount: mount, treat: treat, setHp: setHp, cured: cured, newPatient: newPatient, celebrate: celebrate, mood: mood };
})(this);
