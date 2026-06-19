import { Hono } from "hono";
import { ProfilesHandler } from "./profiles.handler.js";

export const profilesRoutes = new Hono();
const profilesHandler = new ProfilesHandler();

profilesRoutes.get("/", profilesHandler.index);
