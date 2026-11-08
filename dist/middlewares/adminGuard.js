"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminGuard = createAdminGuard;
const httpStatus_1 = require("../helpers/httpStatus");
const httpResponses_1 = require("../helpers/httpResponses");
const adminPermission_1 = require("../enums/adminPermission");
/**
 * Build a `requireAdmin(...permissions)` middleware for a service.
 *
 * The role is read from the database on every admin request (not from the JWT),
 * because app tokens live for 365 days — a demoted admin must lose access at once.
 * Commons doesn't depend on mongoose, so each service passes its own loader:
 *
 *   const requireAdmin = createAdminGuard((id) =>
 *     User.findById(id).select("role accountStatus full_name user_name email photo").lean());
 *
 * Must run after `verifyToken`.
 */
function createAdminGuard(loadUser) {
    return function requireAdmin(...required) {
        return async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    return res
                        .status(httpStatus_1.httpStatus.UNAUTHORIZED)
                        .json((0, httpResponses_1.errorResponse)("Authentication required"));
                }
                const user = await loadUser(String(userId));
                if (!user ||
                    !(0, adminPermission_1.isAdminRole)(user.role) ||
                    (user.accountStatus && user.accountStatus !== "active")) {
                    return res
                        .status(httpStatus_1.httpStatus.FORBIDDEN)
                        .json((0, httpResponses_1.errorResponse)("Admin access required"));
                }
                if (!(0, adminPermission_1.roleHasPermissions)(user.role, required)) {
                    return res
                        .status(httpStatus_1.httpStatus.FORBIDDEN)
                        .json((0, httpResponses_1.errorResponse)(`Your role (${user.role}) can't do this. Missing: ${required
                        .filter((p) => !(0, adminPermission_1.permissionsForRole)(user.role).includes(p))
                        .join(", ")}`));
                }
                const admin = {
                    id: String(user._id),
                    role: user.role,
                    permissions: (0, adminPermission_1.permissionsForRole)(user.role),
                    full_name: user.full_name,
                    user_name: user.user_name,
                    email: user.email,
                    photo: user.photo,
                };
                req.admin = admin;
                next();
            }
            catch (error) {
                next(error);
            }
        };
    };
}
