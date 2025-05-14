-- 2.4 Consulta com JOIN Simples
--
-- Dadas as tabelas: 
--
-- orders 
-- id (INT)
-- customer_id (INT)
-- total (DECIMAL)
--
-- customers
-- id (INT)
-- name (VARCHAR)
-- country (VARCHAR)
--
-- Escreva uma query para listar o nome dos clientes e o total de compras realizadas, ordenando pelo
-- total de compras em ordem decrescente. Inclua apenas os clientes que realizaram compras.

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  country VARCHAR(255)
);

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  total DECIMAL(10, 2)
);

INSERT INTO customers (id, name, country) VALUES
  (1, 'John Doe', 'USA'),
  (2, 'Jane Smith', 'Canada'),
  (3, 'Bob Johnson', 'UK'),
  (4, 'Alice Brown', 'Australia'),
  (5, 'Charlie Davis', 'Germany');

INSERT INTO orders (id, customer_id, total) VALUES
  (1, 1, 100.00),
  (2, 2, 200.00),
  (3, 3, 300.00),
  (4, 4, 400.00),
  (5, 5, 500.00),
  (6, 1, 150.00),
  (7, 2, 250.00),
  (8, 3, 350.00),
  (9, 4, 450.00),
  (10, 5, 550.00);