// オンライン対戦（P2P）の通信まわり。メッセージの作成・検証と、合言葉→接続IDの変換
// 相手から届くデータは信用せず、必ず parse で検証してから使う
(function (root) {
  'use strict';
  var PREFIX = 'inflation-hospital-';
  var CODE_RE = /^[A-Za-z0-9぀-ヿ一-鿿_-]{1,24}$/;

  function normalizeCode(s) { return String(s == null ? '' : s).trim().toLowerCase(); }
  function validCode(s) { return CODE_RE.test(normalizeCode(s)); }
  // 合言葉 → PeerJS の ID（日本語も使えるよう英数字に変換する）
  function roomId(code) {
    var c = normalizeCode(code);
    if (!CODE_RE.test(c)) return null;
    var hex = '';
    for (var i = 0; i < c.length; i++) hex += c.charCodeAt(i).toString(16) + '-';
    return PREFIX + hex.replace(/-$/, '');
  }

  function bigOk(b) {
    return !!b && typeof b === 'object' && typeof b.m === 'number' && typeof b.e === 'number' &&
      isFinite(b.m) && isFinite(b.e) && b.m >= 0 && b.m < 10 && Math.floor(b.e) === b.e &&
      Math.abs(b.e) < 1e6 && (b.m > 0 || b.e === 0);
  }
  // 治療したときに送る：治療回数・1回のダメージ・自分の数字
  function makeTreat(treats, perTap, mine) {
    return JSON.stringify({ t: 'treat', treats: treats, perTap: { m: perTap.m, e: perTap.e }, mine: { m: mine.m, e: mine.e } });
  }
  // 検証。不正なら null
  function parse(raw) {
    var o;
    try { o = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { return null; }
    if (!o || o.t !== 'treat') return null;
    if (typeof o.treats !== 'number' || !isFinite(o.treats) || o.treats < 0 || Math.floor(o.treats) !== o.treats) return null;
    if (!bigOk(o.perTap) || !bigOk(o.mine)) return null;
    return { treats: o.treats, perTap: { m: o.perTap.m, e: o.perTap.e }, mine: { m: o.mine.m, e: o.mine.e } };
  }

  var api = { roomId: roomId, validCode: validCode, makeTreat: makeTreat, parse: parse };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Net = api;
})(this);
