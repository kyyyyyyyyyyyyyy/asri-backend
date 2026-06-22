import { Hono } from "hono";

import { ProductsHandler } from "./products.handler.js";
import { validateMultipart } from "../../shared/middleware/validateMultipart.middlewares.js";
import { createProductMultipartSchema, updateProductMultipartSchema } from "./products.validation.js";


export const productsRoutes = new Hono();

const productsHandler = new ProductsHandler();

// GET
productsRoutes.get("/", productsHandler.getProducts);
productsRoutes.get("/:id", productsHandler.getProductById);
productsRoutes.get("/store/:storeId", productsHandler.getProductsByStore);

// POST (multipart form handled in handler)
productsRoutes.post(
  "/",
  validateMultipart(createProductMultipartSchema),
  productsHandler.createProduct
);

// PATCH
productsRoutes.patch(
  "/:id",
  validateMultipart(updateProductMultipartSchema),
  productsHandler.updateProduct
);

productsRoutes.patch(
  "/:id/restore",
  productsHandler.restoreProduct
);

// DELETE
productsRoutes.delete("/:id", productsHandler.deleteProduct);

productsRoutes.delete(
  "/:id/hard",
  productsHandler.hardDeleteProduct
);

// note: belum pake middleware tapi semua endpoint berjalan, issue upload gamabr up to 3s (bisa di akalian di pecah tergantung kesepakaatn dengan FE)