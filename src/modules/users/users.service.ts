import type { UserRole } from "../../shared/constants/role.constant.js";
import { UsersRepository } from "./users.repository.js";

export class UsersService {
  constructor(private readonly usersRepository = new UsersRepository()) {}

  getProfile(userId: string) {
    return this.usersRepository.findById(userId);
  }

  updateProfile(userId: string, payload: { name?: string; avatarUrl?: string | null }) {
    return this.usersRepository.update(userId, payload);
  }

  changeRole(userId: string, role: UserRole) {
    return this.usersRepository.update(userId, { role });
  }
}
