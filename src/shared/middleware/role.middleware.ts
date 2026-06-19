import type { MiddlewareHandler } from "hono";
import type { UserRole } from "../constants/role.constant.js";
import { errorResponse } from "../utils/response.js";

export function roleMiddleware(allowedRoles: UserRole[]): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get("user");

    if (!user || !allowedRoles.includes(user.role)) {
      return c.json(
        errorResponse("Forbidden", {
          context: {
            allowedRoles,
            currentRole: user?.role,
            method: c.req.method,
            path: c.req.path
          }
        }),
        403
      );
    }

    await next();
  };
}
