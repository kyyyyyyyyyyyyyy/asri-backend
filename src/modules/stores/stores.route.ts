import { Hono } from "hono";
import { StoresHandler } from "./stores.handler.js";

export const storesRoutes = new Hono();
const storesHandler = new StoresHandler();

storesRoutes.get("/", storesHandler.index);
