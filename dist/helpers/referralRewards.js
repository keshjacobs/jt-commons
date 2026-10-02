"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferrerPostReward = exports.getReferrerSignupReward = exports.getBadgeLevelForPoints = exports.REFERRAL_POST_REWARD_WINDOW_DAYS = exports.REFERRED_USER_SIGNUP_REWARD = void 0;
const enums_1 = require("../enums");
// Badge points the referred user gets for signing up with a referral code.
exports.REFERRED_USER_SIGNUP_REWARD = 20;
// How long after signing up a referred user's first post still rewards the referrer.
exports.REFERRAL_POST_REWARD_WINDOW_DAYS = 30;
// Highest badge first; each tier is looked up by the referrer's badge points.
const REFERRAL_REWARD_TIERS = [
    { minPoints: enums_1.BadgePoints.changeMaker, level: enums_1.BadgeLevels.changeMaker, signupReward: 35, postReward: 7 },
    { minPoints: enums_1.BadgePoints.ambassador, level: enums_1.BadgeLevels.ambassador, signupReward: 30, postReward: 6 },
    { minPoints: enums_1.BadgePoints.influencer, level: enums_1.BadgeLevels.influencer, signupReward: 25, postReward: 5 },
    { minPoints: enums_1.BadgePoints.builder, level: enums_1.BadgeLevels.builder, signupReward: 20, postReward: 4 },
    { minPoints: enums_1.BadgePoints.initiator, level: enums_1.BadgeLevels.initiator, signupReward: 15, postReward: 3 },
    { minPoints: enums_1.BadgePoints.contributor, level: enums_1.BadgeLevels.contributor, signupReward: 10, postReward: 2 },
    { minPoints: enums_1.BadgePoints.supporter, level: enums_1.BadgeLevels.supporter, signupReward: 5, postReward: 1 },
    { minPoints: enums_1.BadgePoints.base, level: enums_1.BadgeLevels.base, signupReward: 0, postReward: 0 },
];
const getTier = (badgePoints) => {
    const points = badgePoints ?? enums_1.BadgePoints.base;
    return (REFERRAL_REWARD_TIERS.find((t) => points >= t.minPoints) ??
        REFERRAL_REWARD_TIERS[REFERRAL_REWARD_TIERS.length - 1]);
};
const getBadgeLevelForPoints = (badgePoints) => getTier(badgePoints).level;
exports.getBadgeLevelForPoints = getBadgeLevelForPoints;
// Points the referrer earns when someone signs up with their code.
const getReferrerSignupReward = (referrerBadgePoints) => getTier(referrerBadgePoints).signupReward;
exports.getReferrerSignupReward = getReferrerSignupReward;
// Points the referrer earns when the referred user posts within the reward window.
const getReferrerPostReward = (referrerBadgePoints) => getTier(referrerBadgePoints).postReward;
exports.getReferrerPostReward = getReferrerPostReward;
