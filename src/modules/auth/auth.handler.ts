import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { AuthService } from "./auth.service.js";

export class AuthHandler {
  constructor(private readonly authService = new AuthService()) {}

  logout = async (c: Context) => {
    const user = c.get("user");
    await this.authService.logout(user.userId);

    return c.json(successResponse("Logged out"));
  };
}
