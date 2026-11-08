export declare enum AdminPermission {
    view_dashboard = "view_dashboard",// dashboard, analytics, lists
    moderate = "moderate",// hide/remove casts, dissolve chats, reset photos
    suspend = "suspend",// suspend / ban / shadow-ban users
    reveal_anon = "reveal_anon",// see who posted an anonymous cast
    verify = "verify",// grant / remove the verified badge
    support = "support",// OTP resends, appeals
    push = "push",// push campaigns & banners
    monetization = "monetization",// ads & monetization config
    config = "config",// feature flags & app config
    team = "team",// manage admins & roles
    export = "export"
}
/** Role strings mirror jt-models' UserRoles; kept as plain strings so commons has no model dependency. */
export type AdminRole = "admin" | "super_admin";
export declare const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]>;
export declare const isAdminRole: (role: unknown) => role is AdminRole;
export declare const permissionsForRole: (role: unknown) => AdminPermission[];
export declare const roleHasPermissions: (role: unknown, required: AdminPermission[]) => boolean;
