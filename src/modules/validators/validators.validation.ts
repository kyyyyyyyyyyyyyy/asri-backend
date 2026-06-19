import { z } from "zod";

export const approvalSchema = z.object({
  targetId: z.string().uuid(),
  notes: z.string().optional()
});
