import { PointsCampaign } from "jt-models";

// Base rate: every 1000 wallet points is worth ₦20 before any campaign multiplier.
export const POINTS_PER_WITHDRAWAL_UNIT = 1000;
export const NAIRA_PER_WITHDRAWAL_UNIT = 20;

// Smallest payout allowed, checked after the multiplier is applied.
export const MIN_WITHDRAWAL_NAIRA = 20000;

// The campaign running right now, if any. Admin endpoints stop campaigns overlapping,
// but if two ever do, the most recently started one wins.
export const getActiveCampaign = async (at: Date = new Date()) => {
  return await PointsCampaign.findOne({
    startDate: { $lte: at },
    endDate: { $gt: at },
  }).sort({ startDate: -1 });
};

// Naira owed for a number of points. Worked out in kobo and rounded down so
// float maths never pays out more than the rate allows.
export const calculateWithdrawal = (points: number, multiplier: number = 1) => {
  const kobo = Math.floor(
    (points * NAIRA_PER_WITHDRAWAL_UNIT * 100 * multiplier) /
      POINTS_PER_WITHDRAWAL_UNIT,
  );
  const amount = kobo / 100;

  return {
    points,
    multiplier,
    nairaPerThousandPoints: NAIRA_PER_WITHDRAWAL_UNIT,
    amount,
    meetsMinimum: amount >= MIN_WITHDRAWAL_NAIRA,
  };
};

// Fewest points that clear the minimum at a given multiplier.
export const getMinWithdrawalPoints = (multiplier: number = 1) =>
  Math.ceil(
    (MIN_WITHDRAWAL_NAIRA * POINTS_PER_WITHDRAWAL_UNIT) /
      (NAIRA_PER_WITHDRAWAL_UNIT * multiplier),
  );
