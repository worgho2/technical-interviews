SELECT account_id, month, total_amount
FROM monthly_summary
WHERE total_amount > 10000
ORDER BY account_id, month;