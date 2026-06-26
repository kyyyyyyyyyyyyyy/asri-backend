import { Hono } from "hono";
import { OrdersHandler } from "./orders.handler.js";
import { validateBody } from "../../shared/middleware/validation.middleware.js";
import { createOrderSchema } from "./orders.validation.js";

export const ordersRoutes = new Hono();
const ordersHandler = new OrdersHandler();

ordersRoutes.get("/", ordersHandler.getOrders);
ordersRoutes.get("/:id", ordersHandler.getOrderById);
ordersRoutes.post("/", validateBody(createOrderSchema), ordersHandler.createOrder);
ordersRoutes.patch("/:id/cancel", ordersHandler.cancelOrder);

//note: belum pake middleware tapi semuanya oke