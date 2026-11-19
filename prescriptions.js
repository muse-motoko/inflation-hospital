// 処方システム：強さは「処方（取得した効果の積み重ね）」だけで決まる（レベルはない）
(function (root) {
  'use strict';
  var B = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('./bignum.js') : root.BigNum;

  // kind: 'mul'＝倍率、'digit'＝桁アップ（万の位が一つ上がる＝×10000）、'add'＝加算
  var POOL = [
    { id: 'x10',    name: '×10 処方',     desc: '1回の治療のダメージが10倍',        kind: 'mul',   factor: 10,     fx: '×10' },
    { id: 'x10b',   name: '×10 特効薬',   desc: '1回の治療のダメージが10倍',        kind: 'mul',   factor: 10,     fx: '×10' },
    { id: 'x100',   name: '×100 大処方',  desc: '1回の治療のダメージが100倍',       kind: 'mul',   factor: 100,    fx: '×100' },
    { id: 'digit',  name: '桁アップ注射', desc: '桁が一つ上がる（万倍）',            kind: 'digit', factor: 10000,  fx: '桁アップ！' },
    { id: 'digit2', name: '桁アップ点滴', desc: '桁が一つ上がる（万倍）',            kind: 'digit', factor: 10000,  fx: '桁アップ！' },
    { id: 'x2',     name: '×2 倍量',      desc: '1回の治療のダメージが2倍',         kind: 'mul',   factor: 2,      fx: '×2' },
    { id: 'x1000',  name: '×1000 劇薬',   desc: '1回の治療のダメージが1000倍',      kind: 'mul',   factor: 1000,   fx: '×1000' }
  ];

  // 3択を作る（重複なし）。rand は 0以上1未満を返す関数（テスト用に差し替え可）
  function offer(rand) {
    rand = rand || Math.random;
    var pool = POOL.slice(), out = [];
    while (out.length < 3 && pool.length) {
      out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
    }
    return out;
  }

  // 処方を適用：perTap を更新した新しい state を返す
  function apply(state, p) {
    var taken = (state.taken || []).concat([p.id]);
    return {
      perTap: B.mul(state.perTap, B.from(p.factor)),
      taken: taken
    };
  }

  var api = { POOL: POOL, offer: offer, apply: apply };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Prescriptions = api;
})(this);
