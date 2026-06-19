import { Hono } from "hono";
import { ProductValidationsHandler } from "./product-validations.handler.js";

export const productValidationsRoutes = new Hono();
const productValidationsHandler = new ProductValidationsHandler();

productValidationsRoutes.get("/", productValidationsHandler.index);
