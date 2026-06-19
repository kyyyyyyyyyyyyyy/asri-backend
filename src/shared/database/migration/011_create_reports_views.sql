CREATE OR REPLACE VIEW sales_report_view AS
SELECT
  DATE_TRUNC('day', orders.created_at) AS sales_date,
  COUNT(*) AS order_count,
  COALESCE(SUM(orders.total_amount), 0) AS total_sales
FROM orders
GROUP BY DATE_TRUNC('day', orders.created_at);

CREATE OR REPLACE VIEW revenue_report_view AS
SELECT
  DATE_TRUNC('day', transactions.paid_at) AS revenue_date,
  COALESCE(SUM(transactions.amount), 0) AS total_revenue
FROM transactions
WHERE transactions.status = 'paid'
GROUP BY DATE_TRUNC('day', transactions.paid_at);
