import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { OrdersService } from "./orders.service.js";

export class OrdersHandler {
  constructor(private readonly ordersService = new OrdersService()) {}

  index = (c: Context) => c.json(successResponse("Orders module ready"));
}
