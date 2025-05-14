-- 2.2 Identificar Registros Duplicados
-- 
-- Dada a tabela users com as colunas:
-- 
-- id (INT)
-- email (VARCHAR)
-- name (VARCHAR)
--
-- Escreva uma query para identificar os emails que estão duplicados, juntamente com o número de
-- ocorrências.

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255)
);

insert into users (id, email, name) VALUES
  (1, '1@gmail.com', '1'),
  (2, '1@gmail.com', '2'),
  (3, '2@gmail.com', '3'),
  (4, '3@gmail.com', '4'),
  (5, '3@gmail.com', '5'),
  (6, '4@gmail.com', '6'),
  (7, '5@gmail.com', '7'),
  (8, '5@gmail.com', '8'),
  (9, '5@gmail.com', '9'),
  (10, '7@gmail.com', '10');