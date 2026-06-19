import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { UsersService } from "./users.service.js";

export class UsersHandler {
  constructor(private readonly usersService = new UsersService()) {}

  getProfile = async (c: Context) => {
    const user = c.get("user");
    const profile = await this.usersService.getProfile(user.userId);

    return c.json(successResponse("Profile retrieved", { data: profile }));
  };
}
