import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1)
});

export const updateStoreSchema = createStoreSchema
  .partial()
  .extend({
    is_active: z.boolean().optional()
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required"
  });
