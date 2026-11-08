// middlewares/adminGuard.ts
import { Request, Response, NextFunction } from "express";
import { httpStatus } from "../helpers/httpStatus";
import { errorResponse } from "../helpers/httpResponses";
import {
  AdminPermission,
  AdminRole,
  isAdminRole,
  permissionsForRole,
  roleHasPermissions,
} from "../enums/adminPermission";

/** Minimal shape the guard needs from the user record. */
export interface AdminRecord {
  _id: any;
  role?: string;
  accountStatus?: string;
  full_name?: string;
  user_name?: string;
  email?: string;
  photo?: string;
}

/** Attached to `req.admin` once the guard passes. */
export interface AdminContext {
  id: string;
  role: AdminRole;
  permissions: AdminPermission[];
  full_name?: string;
  user_name?: string;
  email?: string;
  photo?: string;
}

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
export function createAdminGuard(loadUser: (id: string) => Promise<AdminRecord | null>) {
  return function requireAdmin(...required: AdminPermission[]) {
    return async (req: Request | any, res: Response, next: NextFunction) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .json(errorResponse("Authentication required"));
        }

        const user = await loadUser(String(userId));

        if (
          !user ||
          !isAdminRole(user.role) ||
          (user.accountStatus && user.accountStatus !== "active")
        ) {
          return res
            .status(httpStatus.FORBIDDEN)
            .json(errorResponse("Admin access required"));
        }

        if (!roleHasPermissions(user.role, required)) {
          return res
            .status(httpStatus.FORBIDDEN)
            .json(
              errorResponse(
                `Your role (${user.role}) can't do this. Missing: ${required
                  .filter((p) => !permissionsForRole(user.role).includes(p))
                  .join(", ")}`,
              ),
            );
        }

        const admin: AdminContext = {
          id: String(user._id),
          role: user.role,
          permissions: permissionsForRole(user.role),
          full_name: user.full_name,
          user_name: user.user_name,
          email: user.email,
          photo: user.photo,
        };
        req.admin = admin;
        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
