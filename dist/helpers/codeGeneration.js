"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
exports.getVerificationCodeExpiryDate = getVerificationCodeExpiryDate;
const generateVerificationCode = (length) => {
    let generatedCode = "";
    while (generatedCode.length < length) {
        let numbers = "123456789".split("");
        let result = Math.random() * (numbers.length - 1);
        let index = result.toFixed(0);
        let randomNumber = numbers[Number(index)];
        generatedCode = generatedCode + randomNumber;
    }
    return generatedCode;
};
exports.generateVerificationCode = generateVerificationCode;
/**
 * Set verification code to expire in 1 hour.
 * Do this by converting the current date to millisecond to it and adding 1 hour.
 * Note to account for offset so time is accurate
 */
function getVerificationCodeExpiryDate() {
    const currentDate = new Date();
    const offset = currentDate.getTimezoneOffset() * 60 * 1000;
    const correctedDateWithoutOffset = currentDate.getTime() - offset;
    // convert 1 hour to milliseconds
    const oneHourInMilliseconds = 60 * 60 * 1000;
    const expiryDateInMilliseconds = correctedDateWithoutOffset + oneHourInMilliseconds;
    // Return the expiry date in ISOString format
    const expiryDateInIsoStringFormat = new Date(expiryDateInMilliseconds).toISOString();
    // Convert to Date type
    return new Date(expiryDateInIsoStringFormat);
}
