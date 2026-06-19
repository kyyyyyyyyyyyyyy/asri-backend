import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { DriversService } from "./drivers.service.js";

export class DriversHandler {
  constructor(private readonly driversService = new DriversService()) {}

  index = (c: Context) => c.json(successResponse("Drivers module ready"));
}
