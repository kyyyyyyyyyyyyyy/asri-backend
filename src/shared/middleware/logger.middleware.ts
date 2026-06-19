import type { MiddlewareHandler } from "hono";

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const startedAt = Date.now();
  await next();
  const elapsed = Date.now() - startedAt;
  console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${elapsed}ms`);
};
