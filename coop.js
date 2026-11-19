// 協力治療：2人分の攻撃力が合わさる。相手はいまはダミー（通信は後のステップ）
(function (root) {
  'use strict';
  var B = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('./bignum.js') : root.BigNum;

  // 合わさった攻撃力（自分 + 相手）
  function combine(mine, partner) { return B.add(mine, partner); }

  // ダミーの相手：患者を倒すたびに攻撃力が 10 倍になる（処方を選んだ想定）
  function dummyPartner() {
    var perTap = B.from(1);
    return {
      get perTap() { return perTap; },
      onDefeat: function () { perTap = B.mul(perTap, B.from(10)); }
    };
  }

  var api = { combine: combine, dummyPartner: dummyPartner };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Coop = api;
})(this);
