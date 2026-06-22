import type { Context, Next } from "hono";
import { errorResponse } from "../utils/response.js";

type MultipartSchema<T> = {
  fields: {
    [K in keyof T]: {
      required?: boolean;
      type: "string" | "number" | "boolean";
    };
  };
};

function parseValue(
  value: FormDataEntryValue | null,
  type: "string" | "number" | "boolean"
) {
  if (value === null) return null;

  const str = String(value);

  switch (type) {
    case "number":
      return Number(str);
    case "boolean":
      return str === "true";
    default:
      return str;
  }
}

export function validateMultipart<T>(
  schema: MultipartSchema<T>
) {
  return async (c: Context, next: Next) => {
    const form = await c.req.formData();

    const result: any = {};

    for (const key in schema.fields) {
      const rule = schema.fields[key];
      const value = form.get(key);

      if (!value && rule.required) {
        return c.json(
          errorResponse(`${key} is required`),
          400
        );
      }

      result[key] = parseValue(value, rule.type);
    }

    // attach parsed body
    c.set("validatedBody", result);

    // attach files separately
    const files =
    form.getAll(
        "add_images"
    ) as File[];

    c.set(
    "files",
    files
    );

    c.set(
    "deleteImages",
    form.getAll(
        "delete_images"
    )
    );

    await next();
  };
}