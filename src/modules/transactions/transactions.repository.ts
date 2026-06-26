import { query } from "../../shared/database/postgres.js";
import type { Transaction } from "./transactions.model.js";

type TransactionRow = {
  id: string;
  order_id: string;
  status: string;
  amount: string;
  transaction_code: string | null;
  payment_type: string | null;
  payment_reference: string | null;
  gateway_transaction_id: string | null;
  snap_token: string | null;
  paid_at: Date | null;
  expired_at: Date | null;
  transaction_time: Date | null;
  created_at: Date;
  updated_at: Date;
};

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    orderId: row.order_id,
    status: row.status as Transaction["status"],
    amount: Number(row.amount),
    transactionCode: row.transaction_code,
    paymentType: row.payment_type,
    paymentReference: row.payment_reference,
    gatewayTransactionId: row.gateway_transaction_id,
    snapToken: row.snap_token,
    paidAt: row.paid_at,
    expiredAt: row.expired_at,
    transactionTime: row.transaction_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const columns = `
  id,
  order_id,
  status,
  amount,
  transaction_code,
  payment_type,
  payment_reference,
  gateway_transaction_id,
  snap_token,
  paid_at,
  expired_at,
  transaction_time,
  created_at,
  updated_at
`;

export class TransactionsRepository {
  async findByTransactionCode(code: string): Promise<Transaction | null> {
    const result = await query<TransactionRow>(
      `SELECT ${columns} FROM transactions WHERE transaction_code=$1 LIMIT 1`,
      [code]
    );

    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async findById(id: string): Promise<Transaction | null> {
    const result = await query<TransactionRow>(
      `SELECT ${columns} FROM transactions WHERE id=$1 LIMIT 1`,
      [id]
    );

    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async findByOrderId(orderId: string): Promise<Transaction | null> {
    const result = await query<TransactionRow>(
      `SELECT ${columns} FROM transactions WHERE order_id=$1 LIMIT 1`,
      [orderId]
    );

    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async updatePayment(id: string, data: {
    status: string;
    paymentType?: string;
    gatewayTransactionId?: string;
    paidAt?: Date;
    transactionTime?: Date;
  }): Promise<Transaction | null> {
    const sets: string[] = [];
    const values: unknown[] = [id];
    let idx = 2;

    sets.push(`status=$${idx++}`);
    values.push(data.status);

    if (data.paymentType !== undefined) {
      sets.push(`payment_type=$${idx++}`);
      values.push(data.paymentType);
    }

    if (data.gatewayTransactionId !== undefined) {
      sets.push(`gateway_transaction_id=$${idx++}`);
      values.push(data.gatewayTransactionId);
    }

    if (data.paidAt !== undefined) {
      sets.push(`paid_at=$${idx++}`);
      values.push(data.paidAt);
    }

    if (data.transactionTime !== undefined) {
      sets.push(`transaction_time=$${idx++}`);
      values.push(data.transactionTime);
    }

    sets.push(`updated_at=NOW()`);

    const result = await query<TransactionRow>(
      `UPDATE transactions SET ${sets.join(", ")} WHERE id=$1 RETURNING ${columns}`,
      values
    );

    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }
}
