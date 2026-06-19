import { Hono } from "hono";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { UsersHandler } from "./users.handler.js";

export const usersRoutes = new Hono();
const usersHandler = new UsersHandler();

usersRoutes.get("/me", authMiddleware, usersHandler.getProfile);
