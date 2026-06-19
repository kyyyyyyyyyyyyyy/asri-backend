import type { JwtPayload } from "../utils/jwt.js";

declare module "hono" {
  interface ContextVariableMap {
    user: JwtPayload;
    validatedBody: unknown;
  }
}
