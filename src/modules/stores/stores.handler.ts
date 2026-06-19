import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { StoresService } from "./stores.service.js";

export class StoresHandler {
  constructor(private readonly storesService = new StoresService()) {}

  index = (c: Context) => c.json(successResponse("Stores module ready"));
}
