import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ProfilesService } from "./profiles.service.js";

export class ProfilesHandler {
  constructor(private readonly profilesService = new ProfilesService()) {}

  index = (c: Context) => c.json(successResponse("Profiles module ready"));
}
