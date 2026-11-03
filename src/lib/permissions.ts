// Role and permission definitions. Shared by the seed script and by runtime checks.
// Keep this file free of server-only imports so it can be used from the seed, the proxy and components.

export const ROLE_NAMES = ["SUPER_ADMIN", "ADMIN", "RESERVATION_STAFF", "TICKET_STAFF"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  EVENTS_MANAGE: "events.manage",
  DJS_MANAGE: "djs.manage",
  MENU_MANAGE: "menu.manage",
  VIP_MANAGE: "vip.manage",
  GALLERY_MANAGE: "gallery.manage",
  PROMOTIONS_MANAGE: "promotions.manage",
  RESERVATIONS_MANAGE: "reservations.manage",
  TICKETS_MANAGE: "tickets.manage",
  TICKETS_VERIFY: "tickets.verify",
  REPORTS_VIEW: "reports.view",
  USERS_MANAGE: "users.manage",
  SETTINGS_MANAGE: "settings.manage",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as PermissionCode[];

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  SUPER_ADMIN: "Akses penuh ke seluruh sistem",
  ADMIN: "Mengelola konten dan operasional",
  RESERVATION_STAFF: "Mengelola reservasi VIP",
  TICKET_STAFF: "Mengelola dan memverifikasi tiket",
};

export const ROLE_PERMISSIONS: Record<RoleName, PermissionCode[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  ADMIN: ALL_PERMISSIONS.filter((p) => p !== PERMISSIONS.USERS_MANAGE),
  RESERVATION_STAFF: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.RESERVATIONS_MANAGE],
  TICKET_STAFF: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.TICKETS_MANAGE, PERMISSIONS.TICKETS_VERIFY],
};

export function isRoleName(value: unknown): value is RoleName {
  return typeof value === "string" && (ROLE_NAMES as readonly string[]).includes(value);
}

export function hasPermission(role: unknown, permission: PermissionCode): boolean {
  return isRoleName(role) && ROLE_PERMISSIONS[role].includes(permission);
}
