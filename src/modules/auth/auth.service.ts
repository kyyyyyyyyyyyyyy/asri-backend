import { AuthRepository } from "./auth.repository.js";

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  logout(userId: string) {
    return this.authRepository.revokeRefreshToken(userId);
  }
}
