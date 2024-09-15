"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (message, data, meta) => {
    return {
        status: true,
        message: message,
        data: data,
        meta: meta,
    };
};
exports.successResponse = successResponse;
const errorResponse = (message, data) => {
    return {
        status: false,
        message: message,
        data: data,
    };
};
exports.errorResponse = errorResponse;
