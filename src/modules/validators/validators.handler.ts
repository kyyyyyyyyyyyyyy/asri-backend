import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ValidatorsService } from "./validators.service.js";

export class ValidatorsHandler {
  constructor(private readonly validatorsService = new ValidatorsService()) {}

  index = (c: Context) => c.json(successResponse("Validators module ready"));
}
