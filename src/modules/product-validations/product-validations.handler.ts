import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ProductValidationsService } from "./product-validations.service.js";

export class ProductValidationsHandler {
  constructor(private readonly productValidationsService = new ProductValidationsService()) {}

  index = (c: Context) => c.json(successResponse("Product validations module ready"));
}
