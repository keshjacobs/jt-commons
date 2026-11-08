import { Request, Response, NextFunction } from "express";
import { AdminPermission, AdminRole } from "../enums/adminPermission";
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
export declare function createAdminGuard(loadUser: (id: string) => Promise<AdminRecord | null>): (...required: AdminPermission[]) => (req: Request | any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
