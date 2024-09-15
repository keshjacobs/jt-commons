"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jwtModule_1 = __importDefault(require("../lib/jwtModule"));
const httpStatus_1 = require("../helpers/httpStatus");
const httpResponses_1 = require("../helpers/httpResponses");
async function verifyToken(req, res, next) {
    const token = jwtModule_1.default.parseTokenFromAuthorizationHeader(req);
    if (!token) {
        return res
            .status(httpStatus_1.httpStatus.FORBIDDEN)
            .json((0, httpResponses_1.errorResponse)("Bearer token not provided as expected in authorization header"));
    }
    const verifyResult = jwtModule_1.default.verify(token);
    if (!verifyResult || !verifyResult.id) {
        return res
            .status(httpStatus_1.httpStatus.FORBIDDEN)
            .json((0, httpResponses_1.errorResponse)("Bearer token failed verification"));
    }
    req.user = {
        id: verifyResult.id,
    };
    next();
}
