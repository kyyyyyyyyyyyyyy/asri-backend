import type { Context } from "hono";
import { successResponse, errorResponse } from "../../shared/utils/response.js";
import { TransactionsService } from "./transactions.service.js";

export class TransactionsHandler {
  constructor(private readonly transactionsService = new TransactionsService()) {}

  index = (c: Context) => c.json(successResponse("Transactions module ready"));

  notification = async (c: Context) => {
    const body = await c.req.json<Record<string, unknown>>();

    const result = await this.transactionsService.handleNotification(body);

    if (result.status === "error") {
      return c.json(errorResponse(result.message), 400);
    }

    return c.json(successResponse(result.message));
  };
}
