import type { UserRole } from "../../shared/constants/role.constant.js";

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  googleId: string | null;
  role: UserRole;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
