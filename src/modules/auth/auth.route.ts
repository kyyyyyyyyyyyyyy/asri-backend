import { Hono } from "hono";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { AuthHandler } from "./auth.handler.js";

export const authRoutes = new Hono();
const authHandler = new AuthHandler();

authRoutes.post("/logout", authMiddleware, authHandler.logout);
