import { z } from "zod";

export const updateDriverAvailabilitySchema = z.object({
  isAvailable: z.boolean()
});
