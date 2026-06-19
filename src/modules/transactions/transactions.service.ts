import { TransactionsRepository } from "./transactions.repository.js";

export class TransactionsService {
  constructor(private readonly transactionsRepository = new TransactionsRepository()) {}
}
