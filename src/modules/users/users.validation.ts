import { z } from "zod";
import { USER_ROLES } from "../../shared/constants/role.constant.js";

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional()
});

export const changeRoleSchema = z.object({
  role: z.enum(USER_ROLES)
});
