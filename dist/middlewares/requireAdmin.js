"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const jt_models_1 = require("jt-models");
const httpStatus_1 = require("../helpers/httpStatus");
const httpResponses_1 = require("../helpers/httpResponses");
// Use after verifyToken. Admin status is read from the database on every request
// (never trusted from the token). No API endpoint sets the admin flag.
async function requireAdmin(req, res, next) {
    try {
        const user = await jt_models_1.User.findById(req.user?.id).select("admin");
        if (!user || !user.admin) {
            return res
                .status(httpStatus_1.httpStatus.FORBIDDEN)
                .json((0, httpResponses_1.errorResponse)("Admin access required"));
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
