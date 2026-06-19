import type { ErrorHandler } from "hono";
import { ZodError } from "zod";

export const errorMiddleware: ErrorHandler = (error, c) => {
  console.error(error);

  if (error instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: "Validation error",
        errors: error.flatten()
      },
      400
    );
  }

  return c.json(
    {
      success: false,
      message: "Internal server error"
    },
    500
  );
};
