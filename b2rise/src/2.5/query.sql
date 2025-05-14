SELECT categories.name, products.name, SUM(sales.quantity) AS total
FROM products
JOIN categories ON products.category_id = categories.id
JOIN sales ON products.id = sales.product_id
GROUP BY categories.name, products.name
HAVING categories.name IN (
  SELECT c.name
  FROM categories c
  JOIN products p ON p.category_id = c.id
  JOIN sales s ON p.id = s.product_id
  GROUP BY c.name
  HAVING SUM(s.quantity) > 100
)