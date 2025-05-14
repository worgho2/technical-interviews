SELECT product, SUM(quantity * price) AS revenue
FROM sales
GROUP BY product
ORDER BY revenue DESC;