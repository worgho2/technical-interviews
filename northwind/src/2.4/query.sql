SELECT customers.name, SUM(orders.total) AS total
FROM customers
JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id
HAVING COUNT(orders.id) > 0
ORDER BY total DESC;