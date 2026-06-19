import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ReportsService } from "./reports.service.js";

export class ReportsHandler {
  constructor(private readonly reportsService = new ReportsService()) {}

  index = (c: Context) => c.json(successResponse("Reports module ready"));
}
