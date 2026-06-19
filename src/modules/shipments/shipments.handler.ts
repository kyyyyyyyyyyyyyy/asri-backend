import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ShipmentsService } from "./shipments.service.js";

export class ShipmentsHandler {
  constructor(private readonly shipmentsService = new ShipmentsService()) {}

  index = (c: Context) => c.json(successResponse("Shipments module ready"));
}
