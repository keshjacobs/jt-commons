// enums/adminPermission.ts
// Who can do what in the admin console. Keys match the admin frontend's PERMISSIONS list.

export enum AdminPermission {
  view_dashboard = "view_dashboard", // dashboard, analytics, lists
  moderate = "moderate", // hide/remove casts, dissolve chats, reset photos
  suspend = "suspend", // suspend / ban / shadow-ban users
  reveal_anon = "reveal_anon", // see who posted an anonymous cast
  verify = "verify", // grant / remove the verified badge
  support = "support", // OTP resends, appeals
  push = "push", // push campaigns & banners
  monetization = "monetization", // ads & monetization config
  config = "config", // feature flags & app config
  team = "team", // manage admins & roles
  export = "export", // data exports
}

/** Role strings mirror jt-models' UserRoles; kept as plain strings so commons has no model dependency. */
export type AdminRole = "admin" | "super_admin";

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  // Owner-level: everything.
  super_admin: Object.values(AdminPermission),
  // Day-to-day operations. Can't touch config, the admin team, monetization,
  // or de-anonymise casters.
  admin: [
    AdminPermission.view_dashboard,
    AdminPermission.moderate,
    AdminPermission.suspend,
    AdminPermission.verify,
    AdminPermission.support,
    AdminPermission.push,
    AdminPermission.export,
  ],
};

export const isAdminRole = (role: unknown): role is AdminRole =>
  role === "admin" || role === "super_admin";

export const permissionsForRole = (role: unknown): AdminPermission[] =>
  isAdminRole(role) ? ROLE_PERMISSIONS[role] : [];

export const roleHasPermissions = (role: unknown, required: AdminPermission[]) => {
  const granted = permissionsForRole(role);
  return required.every((p) => granted.includes(p));
};
