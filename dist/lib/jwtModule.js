"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function sign(payload) {
    const signingOptions = {
        expiresIn: "1d",
    };
    console.log("JWT_KEY:", config_1.default.JWT_TOKEN);
    return jsonwebtoken_1.default.sign(payload, config_1.default.JWT_TOKEN, signingOptions);
}
function parseTokenFromAuthorizationHeader(req) {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader || !authorizationHeader.includes("Bearer ")) {
        return null;
    }
    return req.headers["authorization"].split(" ")[1];
}
function verify(token) {
    const verifyOptions = {
        algorithm: "RS256",
    };
    try {
        return jsonwebtoken_1.default.verify(token, config_1.default.JWT_TOKEN, verifyOptions);
    }
    catch (err) {
        return null;
    }
}
function decode(token) {
    return jsonwebtoken_1.default.decode(token, { complete: true });
}
exports.default = {
    decode,
    sign,
    verify,
    parseTokenFromAuthorizationHeader,
};
