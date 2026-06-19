export type CreateShipmentDto = {
  orderId: string;
  type: "economy" | "express";
  originAddress?: string;
  destinationAddress?: string;
};
