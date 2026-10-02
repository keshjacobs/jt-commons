import { BadgeLevels } from "../enums";
export declare const REFERRED_USER_SIGNUP_REWARD = 20;
export declare const REFERRAL_POST_REWARD_WINDOW_DAYS = 30;
export declare const getBadgeLevelForPoints: (badgePoints?: number) => BadgeLevels;
export declare const getReferrerSignupReward: (referrerBadgePoints?: number) => number;
export declare const getReferrerPostReward: (referrerBadgePoints?: number) => number;
