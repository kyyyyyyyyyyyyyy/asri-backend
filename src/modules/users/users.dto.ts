import type { UserRole } from "../../shared/constants/role.constant.js";

export type CreateUserDto = {
  email: string;
  name: string;
  avatarUrl?: string | null;
  googleId?: string | null;
  role?: UserRole;
};

export type UpdateUserDto = Partial<Pick<CreateUserDto, "name" | "avatarUrl" | "role">>;
