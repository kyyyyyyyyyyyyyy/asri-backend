import type { MiddlewareHandler } from "hono";
import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return c.json(
      errorResponse("Unauthorized", {
        context: {
          method: c.req.method,
          path: c.req.path,
          reason: "Missing bearer token"
        }
      }),
      401
    );
  }

  const token = authorization.replace("Bearer ", "");
  const payload = verifyAccessToken(token);

  c.set("user", payload);
  await next();
};
