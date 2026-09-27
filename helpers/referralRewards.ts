import { BadgeLevels, BadgePoints } from "../enums";

// Badge points the referred user gets for signing up with a referral code.
export const REFERRED_USER_SIGNUP_REWARD = 20;

// How long after signing up a referred user's first post still rewards the referrer.
export const REFERRAL_POST_REWARD_WINDOW_DAYS = 30;

// Highest badge first; each tier is looked up by the referrer's badge points.
const REFERRAL_REWARD_TIERS: {
  minPoints: number;
  level: BadgeLevels;
  signupReward: number;
  postReward: number;
}[] = [
  { minPoints: BadgePoints.changeMaker, level: BadgeLevels.changeMaker, signupReward: 35, postReward: 7 },
  { minPoints: BadgePoints.ambassador, level: BadgeLevels.ambassador, signupReward: 30, postReward: 6 },
  { minPoints: BadgePoints.influencer, level: BadgeLevels.influencer, signupReward: 25, postReward: 5 },
  { minPoints: BadgePoints.builder, level: BadgeLevels.builder, signupReward: 20, postReward: 4 },
  { minPoints: BadgePoints.initiator, level: BadgeLevels.initiator, signupReward: 15, postReward: 3 },
  { minPoints: BadgePoints.contributor, level: BadgeLevels.contributor, signupReward: 10, postReward: 2 },
  { minPoints: BadgePoints.supporter, level: BadgeLevels.supporter, signupReward: 5, postReward: 1 },
  { minPoints: BadgePoints.base, level: BadgeLevels.base, signupReward: 0, postReward: 0 },
];

const getTier = (badgePoints?: number) => {
  const points = badgePoints ?? BadgePoints.base;
  return (
    REFERRAL_REWARD_TIERS.find((t) => points >= t.minPoints) ??
    REFERRAL_REWARD_TIERS[REFERRAL_REWARD_TIERS.length - 1]
  );
};

export const getBadgeLevelForPoints = (badgePoints?: number): BadgeLevels =>
  getTier(badgePoints).level;

// Points the referrer earns when someone signs up with their code.
export const getReferrerSignupReward = (referrerBadgePoints?: number): number =>
  getTier(referrerBadgePoints).signupReward;

// Points the referrer earns when the referred user posts within the reward window.
export const getReferrerPostReward = (referrerBadgePoints?: number): number =>
  getTier(referrerBadgePoints).postReward;
