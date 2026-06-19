import { Hono } from "hono";
import { CategoriesHandler } from "./categories.handler.js";

export const categoriesRoutes = new Hono();
const categoriesHandler = new CategoriesHandler();

categoriesRoutes.get("/", categoriesHandler.index);
