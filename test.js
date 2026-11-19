// 実行: node inflation-hospital/test.js
var B = require('./bignum.js'), assert = require('assert');
var cases = [
  [B.from(10), '10'], [B.from(100), '100'], [B.from(10000), '1万'],
  [B.from(12345678), '1234万5678'],
  [B.pow10(68), '1無量大数'], [B.pow10(72), '1無量大数万'], [B.pow10(76), '1無量大数億'],
];
cases.forEach(function (c) { assert.strictEqual(B.format(c[0]), c[1]); });
var x = B.from(1); for (var i = 0; i < 100; i++) x = B.add(x, B.from(1));
assert.strictEqual(B.format(x), '101');
assert.strictEqual(B.format(B.mul(B.from(10), B.pow10(67))), '1無量大数');
assert.strictEqual(B.cmp(B.pow10(72), B.pow10(68)), 1);
console.log('ok');

// --- 処方システム ---
var P = require('./prescriptions.js');
var o = P.offer();
assert.strictEqual(o.length, 3);
assert.strictEqual(new Set(o.map(function (p) { return p.id; })).size, 3);
var st = { perTap: B.from(1), taken: [] };
var x10 = P.POOL.filter(function (p) { return p.id === 'x10'; })[0];
var dg = P.POOL.filter(function (p) { return p.id === 'digit'; })[0];
st = P.apply(st, x10);
assert.strictEqual(B.format(st.perTap), '10');
st = P.apply(st, dg);
assert.strictEqual(B.format(st.perTap), '10万');   // 桁が一つ上がる
st = P.apply(st, x10);
assert.strictEqual(B.format(st.perTap), '100万');  // 重ねるほど大きくなる
assert.strictEqual(st.taken.length, 3);
console.log('ok (prescriptions)');

// --- 患者の成長 ---
var Pt = require('./patient.js');
var p = Pt.create(0);
assert.strictEqual(B.format(p.hp), '1');
assert.strictEqual(B.format(Pt.maxHp(1)), '1億');
assert.strictEqual(B.format(Pt.maxHp(5)), '1無量大数');
for (var n = 0; n < 12; n++) assert.strictEqual(B.cmp(Pt.maxHp(n + 1), Pt.maxHp(n)), 1); // 次は必ず大きい
var r = Pt.hit(Pt.create(1), B.from(1));
assert.strictEqual(r.defeated, false);
assert.strictEqual(B.format(r.patient.hp), '9999万9999');
r = Pt.hit(Pt.create(0), B.from(5));
assert.strictEqual(r.defeated, true);
var nx = Pt.next(r.patient);
assert.strictEqual(nx.n, 1);
assert.strictEqual(B.format(nx.hp), '1億');
console.log('ok (patient)');

// --- 協力治療 ---
var C = require('./coop.js');
var d = C.dummyPartner();
assert.strictEqual(B.format(C.combine(B.from(100), d.perTap)), '101');
d.onDefeat();
assert.strictEqual(B.format(d.perTap), '10');
assert.strictEqual(B.format(C.combine(B.from(100), d.perTap)), '110');
// 2人分で患者を倒せる
var q = Pt.create(1), tot = C.combine(B.pow10(8), d.perTap);
assert.strictEqual(Pt.hit(q, tot).defeated, true);
console.log('ok (coop)');

// --- オンライン対戦（通信） ---
var N = require('./net.js');
assert.strictEqual(N.roomId('Abc'), N.roomId(' abc '));
assert.notStrictEqual(N.roomId('abc'), N.roomId('abd'));
assert.ok(N.roomId('ひみつ') && /^[a-z0-9-]+$/.test(N.roomId('ひみつ')));
assert.strictEqual(N.roomId(''), null);
assert.strictEqual(N.roomId('a b!'), null);
var msg = N.makeTreat(3, B.from(120), B.from(360));
var got = N.parse(msg);
assert.strictEqual(got.treats, 3);
assert.strictEqual(B.format(got.perTap), '120');
assert.strictEqual(B.format(got.mine), '360');
assert.strictEqual(N.parse('{bad'), null);
assert.strictEqual(N.parse('{"t":"x"}'), null);
assert.strictEqual(N.parse(JSON.stringify({ t: 'treat', treats: -1, perTap: { m: 1, e: 0 }, mine: { m: 1, e: 0 } })), null);
assert.strictEqual(N.parse(JSON.stringify({ t: 'treat', treats: 1, perTap: { m: 50, e: 0 }, mine: { m: 1, e: 0 } })), null);
assert.strictEqual(N.parse(JSON.stringify({ t: 'treat', treats: 1, perTap: { m: 1, e: 1e9 }, mine: { m: 1, e: 0 } })), null);
console.log('ok (net)');

// --- 貢献度と勝敗 ---
var R = require('./result.js');
var j = R.judge(B.from(300), B.from(100));
assert.strictEqual(j.winner, 'mine');
assert.strictEqual(R.judge(B.from(100), B.pow10(8)).winner, 'rival');
assert.strictEqual(R.judge(B.from(0), B.from(0)).winner, 'draw');
assert.strictEqual(R.judge(B.from(5), B.from(5)).winner, 'draw');
var sm = R.summary(R.judge(B.from(12345678), B.from(100)));
assert.strictEqual(sm.mine, '1234万5678');
assert.strictEqual(sm.rival, '100');
assert.ok(sm.top.indexOf('あなた') >= 0);
assert.ok(R.summary(R.judge(B.from(1), B.from(2))).top.indexOf('相手') >= 0);
console.log('ok (result)');
