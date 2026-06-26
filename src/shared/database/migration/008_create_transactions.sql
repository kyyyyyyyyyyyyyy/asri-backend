CREATE TYPE transaction_status AS ENUM ('unpaid', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID NOT NULL
    REFERENCES orders(id) ON DELETE CASCADE,

  status transaction_status NOT NULL DEFAULT 'unpaid',

  amount NUMERIC(14,2) NOT NULL
    CHECK (amount >= 0),

  transaction_code VARCHAR(255) UNIQUE,
  payment_type VARCHAR(100),
  payment_reference VARCHAR(255),
  gateway_transaction_id VARCHAR(255),
  snap_token TEXT,

  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  transaction_time TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
