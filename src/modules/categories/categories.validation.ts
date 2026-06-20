import { string, z } from "zod";

export const createCategorySchema =
  z.object({
    name: z
      .string()
      .min(1),

    slug: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must contain lowercase letters, numbers, and hyphens"
      ),

    description: z
      .string()
      .optional(),

    parent_id: z
      .string()
      .uuid()
      .nullable()
      .optional(),
  });

export const updateCategorySchema =
  createCategorySchema
    .partial()
    .refine(
      (payload) =>
        Object.keys(payload)
          .length > 0,
      {
        message:
          "At least one field is required",
      }
    );