import { Hono } from "hono";
import { validateBody } from "../../shared/middleware/validation.middleware.js";
import { StoresHandler } from "./stores.handler.js";
import { createStoreSchema, updateStoreSchema } from "./stores.validation.js";

export const storesRoutes = new Hono();
const storesHandler = new StoresHandler();

storesRoutes.get("/", storesHandler.getStores);
storesRoutes.get("/me", storesHandler.getMyStores);
storesRoutes.get("/:id", storesHandler.getStoreById);
storesRoutes.post("/", validateBody(createStoreSchema), storesHandler.createStore);
storesRoutes.patch("/:id", validateBody(updateStoreSchema), storesHandler.updateStore);
storesRoutes.delete("/:id", storesHandler.deleteStore);


// note: belum pake middleware tapi semua endpoint berjalan