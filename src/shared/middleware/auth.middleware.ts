import type { MiddlewareHandler } from "hono";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authorization.replace("Bearer ", "");
  const payload = verifyAccessToken(token);

  c.set("user", payload);
  await next();
};
