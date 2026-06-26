import { Hono } from "hono";
import { TransactionsHandler } from "./transactions.handler.js";

export const transactionsRoutes = new Hono();
const transactionsHandler = new TransactionsHandler();

transactionsRoutes.get("/", transactionsHandler.index);
transactionsRoutes.post("/notification", transactionsHandler.notification);

//note: masih bawaan dari order
