import type { MiddlewareHandler } from "hono";
import type { UserRole } from "../constants/role.constant.js";

export function roleMiddleware(allowedRoles: UserRole[]): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get("user");

    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

    await next();
  };
}
