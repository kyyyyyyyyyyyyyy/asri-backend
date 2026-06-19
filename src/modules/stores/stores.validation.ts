import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional()
});
