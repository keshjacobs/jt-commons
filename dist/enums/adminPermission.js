"use strict";
// enums/adminPermission.ts
// Who can do what in the admin console. Keys match the admin frontend's PERMISSIONS list.
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleHasPermissions = exports.permissionsForRole = exports.isAdminRole = exports.ROLE_PERMISSIONS = exports.AdminPermission = void 0;
var AdminPermission;
(function (AdminPermission) {
    AdminPermission["view_dashboard"] = "view_dashboard";
    AdminPermission["moderate"] = "moderate";
    AdminPermission["suspend"] = "suspend";
    AdminPermission["reveal_anon"] = "reveal_anon";
    AdminPermission["verify"] = "verify";
    AdminPermission["support"] = "support";
    AdminPermission["push"] = "push";
    AdminPermission["monetization"] = "monetization";
    AdminPermission["config"] = "config";
    AdminPermission["team"] = "team";
    AdminPermission["export"] = "export";
})(AdminPermission || (exports.AdminPermission = AdminPermission = {}));
exports.ROLE_PERMISSIONS = {
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
const isAdminRole = (role) => role === "admin" || role === "super_admin";
exports.isAdminRole = isAdminRole;
const permissionsForRole = (role) => (0, exports.isAdminRole)(role) ? exports.ROLE_PERMISSIONS[role] : [];
exports.permissionsForRole = permissionsForRole;
const roleHasPermissions = (role, required) => {
    const granted = (0, exports.permissionsForRole)(role);
    return required.every((p) => granted.includes(p));
};
exports.roleHasPermissions = roleHasPermissions;
