import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { TransactionsService } from "./transactions.service.js";

export class TransactionsHandler {
  constructor(private readonly transactionsService = new TransactionsService()) {}

  index = (c: Context) => c.json(successResponse("Transactions module ready"));
}
