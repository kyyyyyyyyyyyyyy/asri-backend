import { Hono } from "hono";
import { ProductsHandler } from "./products.handler.js";

export const productsRoutes = new Hono();
const productsHandler = new ProductsHandler();

productsRoutes.get("/", productsHandler.index);
