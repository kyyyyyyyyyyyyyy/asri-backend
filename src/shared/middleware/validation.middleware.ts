import type { MiddlewareHandler } from "hono";
import type { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema): MiddlewareHandler {
  return async (c, next) => {
    const body = await c.req.json();
    const parsedBody = schema.parse(body);
    c.set("validatedBody", parsedBody);
    await next();
  };
}
