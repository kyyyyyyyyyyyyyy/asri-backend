import { Hono } from "hono";
import { ValidatorsHandler } from "./validators.handler.js";

export const validatorsRoutes = new Hono();
const validatorsHandler = new ValidatorsHandler();

validatorsRoutes.get("/", validatorsHandler.index);
