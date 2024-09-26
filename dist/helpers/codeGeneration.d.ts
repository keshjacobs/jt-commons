export declare const generateVerificationCode: (length: number) => string;
/**
 * Set verification code to expire in 1 hour.
 * Do this by converting the current date to millisecond to it and adding 1 hour.
 * Note to account for offset so time is accurate
 */
export declare function getVerificationCodeExpiryDate(): Date;
