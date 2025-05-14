-- 2.1 Consulta com Agregação
--
-- Dada a tabela sales com as colunas:
-- 
-- id (INT)
-- product (VARCHAR)
-- quantity (INT)
-- price (DECIMAL)
--
-- Escreva uma query para calcular a receita total (quantity * price) para cada produto, ordenando
-- por receita total em ordem decrescente.

-- DROP IF EXISTS
DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
    id INT PRIMARY KEY,
    product VARCHAR(255),
    quantity INT,
    price DECIMAL(10, 2)
);

INSERT INTO sales (id, product, quantity, price) VALUES
  (1, 'A', 10, 100.00),
  (2, 'B', 20, 200.00),
  (3, 'C', 30, 300.00),
  (4, 'D', 40, 400.00),
  (5, 'E', 50, 500.00);