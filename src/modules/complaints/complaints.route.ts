import { Hono } from "hono";
import { ComplaintsHandler } from "./complaints.handler.js";

export const complaintsRoutes = new Hono();
const complaintsHandler = new ComplaintsHandler();

complaintsRoutes.get("/", complaintsHandler.index);
