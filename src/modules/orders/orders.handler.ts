import type { Context } from "hono";
import { successResponse, errorResponse } from "../../shared/utils/response.js";
import { OrdersService } from "./orders.service.js";
import type { CreateOrderDto, OrderQuery } from "./orders.dto.js";

const userId = "00000000-0000-4000-8000-000000000002";

export class OrdersHandler {
  constructor(private readonly ordersService = new OrdersService()) {}

  getOrders = async (c: Context) => {
    const user = c.get("user");
    const query: OrderQuery = {
      page: Number(c.req.query("page")) || 1,
      limit: Number(c.req.query("limit")) || 10,
      buyer_id: c.req.query("buyer_id") || userId,
      status: c.req.query("status") as OrderQuery["status"],
    };

    const result = await this.ordersService.getOrders(query);

    return c.json(successResponse("Orders retrieved", result));
  };

  getOrderById = async (c: Context) => {
    const id = c.req.param("id");

    if (!id) {
      return c.json(errorResponse("Order id is required"), 400);
    }

    const order = await this.ordersService.getOrderById(id);

    if (!order) {
      return c.json(errorResponse("Order not found"), 404);
    }

    return c.json(successResponse("Order retrieved", { data: order }));
  };

  createOrder = async (c: Context) => {
    const payload = c.get("validatedBody") as CreateOrderDto;

    try {
      const result = await this.ordersService.createOrder(payload, userId);
      return c.json(successResponse("Order created", { data: result.order, snap_token: result.snapToken }), 201);
    } catch (error) {
      return c.json(errorResponse((error as Error).message), 400);
    }
  };

  cancelOrder = async (c: Context) => {
    const id = c.req.param("id");

    if (!id) {
      return c.json(errorResponse("Order id is required"), 400);
    }

    const result = await this.ordersService.cancelOrder(id, userId);

    if (result.status === "not_found") {
      return c.json(errorResponse("Order not found"), 404);
    }

    if (result.status === "cannot_cancel") {
      return c.json(errorResponse("Order cannot be cancelled"), 400);
    }

    return c.json(successResponse("Order cancelled", { data: result.order }));
  };
}
