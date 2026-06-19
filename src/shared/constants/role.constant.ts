export const USER_ROLES = ["admin", "seller", "buyer", "validator", "driver"] as const;

export type UserRole = (typeof USER_ROLES)[number];
