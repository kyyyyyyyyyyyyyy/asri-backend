import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { CategoriesService } from "./categories.service.js";

export class CategoriesHandler {
  constructor(private readonly categoriesService = new CategoriesService()) {}

  index = (c: Context) => c.json(successResponse("Categories module ready"));
}
