import { Hono } from "hono";
import { ReportsHandler } from "./reports.handler.js";

export const reportsRoutes = new Hono();
const reportsHandler = new ReportsHandler();

reportsRoutes.get("/", reportsHandler.index);
