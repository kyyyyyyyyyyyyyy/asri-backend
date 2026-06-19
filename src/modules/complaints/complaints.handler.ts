import type { Context } from "hono";
import { successResponse } from "../../shared/utils/response.js";
import { ComplaintsService } from "./complaints.service.js";

export class ComplaintsHandler {
  constructor(private readonly complaintsService = new ComplaintsService()) {}

  index = (c: Context) => c.json(successResponse("Complaints module ready"));
}
