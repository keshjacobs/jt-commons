"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const bcrypt_1 = require("bcrypt");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
class Password {
    static async toHash(password) {
        const salt = (0, crypto_1.randomBytes)(8).toString("hex");
        const buf = (await scryptAsync(password, salt, 64));
        return `${buf.toString("hex")}.${salt}`;
    }
    static async compare(storedPassword, suppliedPassword) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buf = (await scryptAsync(suppliedPassword, salt, 64));
        return buf.toString("hex") === hashedPassword;
    }
    static async encrypt(providedPassword) {
        var hash = (0, bcrypt_1.hashSync)(providedPassword, 10);
        console.log('Generated Hash:', hash);
        return hash;
    }
    static async verify(passwordProvided, hash) {
        console.log("verifying password....");
        if (hash || hash != undefined) {
            return (0, bcrypt_1.compareSync)(passwordProvided, hash);
        }
        else {
            console.log("no saved password");
            return false;
        }
    }
}
exports.Password = Password;
