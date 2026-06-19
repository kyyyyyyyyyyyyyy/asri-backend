import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ProductsService } from "./products.service.js";

export class ProductsHandler {
  constructor(private readonly productsService = new ProductsService()) {}

  index = (c: Context) => c.json(successResponse("Products module ready"));
}
