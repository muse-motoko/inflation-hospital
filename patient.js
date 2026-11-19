// 患者：HP が 1 → 1億 → … → 無量大数 → さらにその先へと膨らむ。0 にすると次の患者が現れる
(function (root) {
  'use strict';
  var B = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('./bignum.js') : root.BigNum;

  // 患者ごとの HP の桁（10^e）。0＝1、8＝1億、68＝無量大数
  var STEPS = [0, 8, 20, 36, 52, 68, 76];
  var LAST = STEPS[STEPS.length - 1];

  // n 人目（0 始まり）の最大 HP。一覧を超えたら、1人ごとに 10^16 倍ずつ大きくなる
  function maxHp(n) {
    var e = n < STEPS.length ? STEPS[n] : LAST + (n - STEPS.length + 1) * 16;
    return B.pow10(e);
  }

  function create(n) {
    return { n: n, max: maxHp(n), hp: maxHp(n) };
  }

  // ダメージを与える。新しい患者状態と、倒したか（defeated）を返す
  function hit(patient, dmg) {
    var hp = B.sub(patient.hp, dmg);
    return { patient: { n: patient.n, max: patient.max, hp: hp }, defeated: hp.m === 0 };
  }

  // 倒したら次の患者（さらに大きな HP）を出す
  function next(patient) { return create(patient.n + 1); }

  var api = { STEPS: STEPS, maxHp: maxHp, create: create, hit: hit, next: next };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Patient = api;
})(this);
