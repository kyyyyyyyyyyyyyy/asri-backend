import type { SHIPMENT_STATUSES, SHIPMENT_TYPES } from "../../shared/constants/status.constant.js";

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];
export type ShipmentType = (typeof SHIPMENT_TYPES)[number];

export type Shipment = {
  id: string;
  orderId: string;
  driverId: string | null;
  type: ShipmentType;
  status: ShipmentStatus;
};
