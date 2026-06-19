import { Hono } from "hono";
import { OrdersHandler } from "./orders.handler.js";

export const ordersRoutes = new Hono();
const ordersHandler = new OrdersHandler();

ordersRoutes.get("/", ordersHandler.index);
