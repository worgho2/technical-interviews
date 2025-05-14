-- 2.5 Consulta com JOIN e Filtragem
--
-- Dadas as tabelas:
-- 
-- products
-- id (INT)
-- name (VARCHAR)
-- category_id (INT)
-- 
-- categories
-- id (INT)
-- name (VARCHAR)
--
-- sales
-- id (INT)
-- product_id (INT)
-- quantity (INT)
--
-- Escreva uma query para listar o nome da categoria, o nome do produto e a quantidade total vendida
-- de cada produto. Filtre apenas as categorias que possuem mais de 100 unidades vendidas no total.

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(255)
);

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  category_id INT
);

DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
  id INT PRIMARY KEY,
  product_id INT,
  quantity INT
);

INSERT INTO categories (id, name) VALUES
  (1, 'Category 1'),
  (2, 'Category 2'),
  (3, 'Category 3'),
  (4, 'Category 4'),
  (5, 'Category 5');

INSERT INTO products (id, name, category_id) VALUES
  (1, 'Product 1', 1),
  (2, 'Product 2', 1),
  (3, 'Product 3', 2),
  (4, 'Product 4', 2),
  (5, 'Product 5', 3),
  (6, 'Product 6', 3),
  (7, 'Product 7', 4),
  (8, 'Product 8', 4),
  (9, 'Product 9', 5),
  (10, 'Product 10', 5);

INSERT INTO sales (id, product_id, quantity) VALUES
  (1, 1, 10),
  (2, 1, 20),
  (3, 2, 30),
  (4, 2, 40),
  (5, 3, 50),
  (6, 3, 60),
  (7, 4, 70),
  (8, 4, 80),
  (9, 5, 90),
  (10, 5, 100),
  (11, 6, 110),
  (12, 6, 120),
  (13, 7, 130),
  (14, 7, 140),
  (15, 8, 150),
  (16, 8, 160),
  (17, 9, 170),
  (18, 9, 180),
  (19, 10, 190),
  (20, 10, 200);