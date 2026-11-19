// 巨大数型：値 = m × 10^e（1 <= m < 10、0 は m=0,e=0）
(function (root) {
  'use strict';
  var UNITS = ['', '万', '億', '兆', '京', '垓', '秭', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];

  // k 番目の単位（10^(4k)）。無量大数(k=17)を超えると「無量大数万」「無量大数億」…と続く
  function unitName(k) {
    if (k < UNITS.length) return UNITS[k];
    return '無量大数' + unitName(k - 17);
  }

  function Big(m, e) {
    this.m = m;
    this.e = e;
  }
  function norm(m, e) {
    if (!(m > 0)) return new Big(0, 0);
    var s = Math.floor(Math.log10(m));
    m = m / Math.pow(10, s);
    e += s;
    if (m >= 10) { m /= 10; e += 1; }      // 浮動小数点の誤差対策
    if (m < 1) { m *= 10; e -= 1; }
    return new Big(m, e);
  }
  function from(n) { return norm(n, 0); }
  function pow10(e) { return new Big(1, e); }
  function add(a, b) {
    if (a.m === 0) return b;
    if (b.m === 0) return a;
    if (a.e < b.e) { var t = a; a = b; b = t; }
    var d = a.e - b.e;
    if (d > 15) return a;
    return norm(a.m + b.m * Math.pow(10, -d), a.e);
  }
  function mul(a, b) {
    if (a.m === 0 || b.m === 0) return new Big(0, 0);
    return norm(a.m * b.m, a.e + b.e);
  }
  function cmp(a, b) {
    if (a.m === 0 || b.m === 0) return a.m === b.m ? 0 : (a.m === 0 ? -1 : 1);
    if (a.e !== b.e) return a.e < b.e ? -1 : 1;
    return a.m === b.m ? 0 : (a.m < b.m ? -1 : 1);
  }
  // 引き算（a >= b のとき。a < b なら 0）
  function sub(a, b) {
    if (cmp(a, b) <= 0) return new Big(0, 0);
    if (b.m === 0) return a;
    var d = a.e - b.e;
    if (d > 15) return a;
    return norm(a.m - b.m * Math.pow(10, -d), a.e);
  }

  // 日本語表記。上位2ブロック（4桁ずつ）まで表示する
  function format(x) {
    if (x.m === 0) return '0';
    var e = x.e;
    var digits = x.m.toFixed(14).replace('.', ''); // 15桁の有効数字
    while (digits.length < e + 1 && digits.length < 40) digits += '0';
    var topLen = (e % 4) + 1;
    var k = Math.floor(e / 4);
    var top = parseInt(digits.slice(0, topLen), 10);
    var out = top + unitName(k);
    if (k >= 1) {
      var next = digits.slice(topLen, topLen + 4);
      while (next.length < 4) next += '0';
      var n = parseInt(next, 10);
      if (n > 0) out += n + unitName(k - 1);
    }
    return out;
  }

  var api = { Big: Big, from: from, pow10: pow10, add: add, sub: sub, mul: mul, cmp: cmp, format: format, unitName: unitName };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BigNum = api;
})(this);
