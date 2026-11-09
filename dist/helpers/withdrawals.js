"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinWithdrawalPoints =
  exports.calculateWithdrawal =
  exports.getActiveCampaign =
  exports.MIN_WITHDRAWAL_NAIRA =
  exports.NAIRA_PER_WITHDRAWAL_UNIT =
  exports.POINTS_PER_WITHDRAWAL_UNIT =
    void 0;
const jt_models_1 = require("jt-models");
// Base rate: every 1000 wallet points is worth ₦20 before any campaign multiplier.
exports.POINTS_PER_WITHDRAWAL_UNIT = 1000;
exports.NAIRA_PER_WITHDRAWAL_UNIT = 20;
// Smallest payout allowed, checked after the multiplier is applied.
exports.MIN_WITHDRAWAL_NAIRA = 20000;
// The campaign running right now, if any. Admin endpoints stop campaigns overlapping,
// but if two ever do, the most recently started one wins.
const getActiveCampaign = async (at = new Date()) => {
  return await jt_models_1.PointsCampaign.findOne({
    startDate: { $lte: at },
    endDate: { $gt: at },
  }).sort({ startDate: -1 });
};
exports.getActiveCampaign = getActiveCampaign;
// Naira owed for a number of points. Worked out in kobo and rounded down so
// float maths never pays out more than the rate allows.
const calculateWithdrawal = (points, multiplier = 1) => {
  const kobo = Math.floor(
    (points * exports.NAIRA_PER_WITHDRAWAL_UNIT * 100 * multiplier) /
      exports.POINTS_PER_WITHDRAWAL_UNIT,
  );
  const amount = kobo / 100;
  return {
    points,
    multiplier,
    nairaPerThousandPoints: exports.NAIRA_PER_WITHDRAWAL_UNIT,
    amount,
    meetsMinimum: amount >= exports.MIN_WITHDRAWAL_NAIRA,
  };
};
exports.calculateWithdrawal = calculateWithdrawal;
// Fewest points that clear the minimum at a given multiplier.
const getMinWithdrawalPoints = (multiplier = 1) =>
  Math.ceil(
    (exports.MIN_WITHDRAWAL_NAIRA * exports.POINTS_PER_WITHDRAWAL_UNIT) /
      (exports.NAIRA_PER_WITHDRAWAL_UNIT * multiplier),
  );
exports.getMinWithdrawalPoints = getMinWithdrawalPoints;
