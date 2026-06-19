import { Hono } from "hono";
import { authRoutes } from "./modules/auth/auth.route.js";
import { categoriesRoutes } from "./modules/categories/categories.route.js";
import { complaintsRoutes } from "./modules/complaints/complaints.route.js";
import { driversRoutes } from "./modules/drivers/drivers.route.js";
import { ordersRoutes } from "./modules/orders/orders.route.js";
import { productValidationsRoutes } from "./modules/product-validations/product-validations.route.js";
import { productsRoutes } from "./modules/products/products.route.js";
import { profilesRoutes } from "./modules/profiles/profiles.route.js";
import { reportsRoutes } from "./modules/reports/reports.route.js";
import { shipmentsRoutes } from "./modules/shipments/shipments.route.js";
import { storesRoutes } from "./modules/stores/stores.route.js";
import { transactionsRoutes } from "./modules/transactions/transactions.route.js";
import { usersRoutes } from "./modules/users/users.route.js";
import { validatorsRoutes } from "./modules/validators/validators.route.js";
import { errorMiddleware } from "./shared/middleware/error.middleware.js";
import { loggerMiddleware } from "./shared/middleware/logger.middleware.js";
import { successResponse } from "./shared/utils/response.js";

export const app = new Hono();

app.use("*", loggerMiddleware);

app.get("/health", (c) => {
  return c.json(
    successResponse("ASRI API is running", {
      timestamp: new Date().toISOString()
    })
  );
});

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);
app.route("/profiles", profilesRoutes);
app.route("/stores", storesRoutes);
app.route("/categories", categoriesRoutes);
app.route("/products", productsRoutes);
app.route("/product-validations", productValidationsRoutes);
app.route("/orders", ordersRoutes);
app.route("/transactions", transactionsRoutes);
app.route("/shipments", shipmentsRoutes);
app.route("/reports", reportsRoutes);
app.route("/complaints", complaintsRoutes);
app.route("/validators", validatorsRoutes);
app.route("/drivers", driversRoutes);

app.onError(errorMiddleware);
