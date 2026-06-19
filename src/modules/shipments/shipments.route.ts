import { Hono } from "hono";
import { ShipmentsHandler } from "./shipments.handler.js";

export const shipmentsRoutes = new Hono();
const shipmentsHandler = new ShipmentsHandler();

shipmentsRoutes.get("/", shipmentsHandler.index);
