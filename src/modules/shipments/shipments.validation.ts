import { z } from "zod";
import { SHIPMENT_STATUSES, SHIPMENT_TYPES } from "../../shared/constants/status.constant.js";

export const createShipmentSchema = z.object({
  orderId: z.string().uuid(),
  type: z.enum(SHIPMENT_TYPES),
  originAddress: z.string().optional(),
  destinationAddress: z.string().optional()
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum(SHIPMENT_STATUSES)
});
