import { Hono } from "hono";
import { DriversHandler } from "./drivers.handler.js";

export const driversRoutes = new Hono();
const driversHandler = new DriversHandler();

driversRoutes.get("/", driversHandler.index);
