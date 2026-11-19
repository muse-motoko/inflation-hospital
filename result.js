// 結果：2人の貢献度（治した量）を比べて勝敗を決める。強さは処方だけで決まる（レベルはない）
(function (root) {
  'use strict';
  var B = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('./bignum.js') : root.BigNum;

  // 何人目の患者を倒したらラウンド終了か（この人数ぶん倒したら結果画面）
  var ROUND_PATIENTS = 3;

  // mine / rival は貢献度（BigNum）。winner: 'mine' | 'rival' | 'draw'
  function judge(mine, rival) {
    var c = B.cmp(mine, rival);
    return { winner: c > 0 ? 'mine' : (c < 0 ? 'rival' : 'draw'), mine: mine, rival: rival };
  }

  // 結果画面に出す文章
  function summary(res) {
    var top = res.winner === 'mine' ? '一番治したのは あなた！'
      : res.winner === 'rival' ? '一番治したのは 相手！'
      : '引き分け！ 2人とも同じだけ治しました';
    return {
      title: res.winner === 'mine' ? 'あなたの勝ち！' : (res.winner === 'rival' ? 'あなたの負け…' : '引き分け'),
      top: top,
      mine: B.format(res.mine),
      rival: B.format(res.rival)
    };
  }

  var api = { ROUND_PATIENTS: ROUND_PATIENTS, judge: judge, summary: summary };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Result = api;
})(this);
