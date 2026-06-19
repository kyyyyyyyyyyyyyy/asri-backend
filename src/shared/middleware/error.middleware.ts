import type { ErrorHandler } from "hono";
import { ZodError } from "zod";
import { errorResponse } from "../utils/response.js";

export const errorMiddleware: ErrorHandler = (error, c) => {
  if (error instanceof ZodError) {
    return c.json(
      errorResponse("Validation error", {
        error,
        context: {
          validation: error.flatten(),
          method: c.req.method,
          path: c.req.path
        }
      }),
      400
    );
  }

  return c.json(
    errorResponse("Internal server error", {
      error,
      context: {
        method: c.req.method,
        path: c.req.path
      }
    }),
    500
  );
};
