import { OrdersRepository } from "./orders.repository.js";

export class OrdersService {
  constructor(private readonly ordersRepository = new OrdersRepository()) {}
}
