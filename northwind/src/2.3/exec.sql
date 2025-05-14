-- 2.3 Atualizar Dados Condicionalmente
--
-- Dada a tabela employees com as colunas:
-- 
-- id (INT)
-- name (VARCHAR)
-- salary (DECIMAL)
--
-- Escreva uma query para aumentar o salário em 10% para os empregados que ganham menos de 5000,
-- mas não altere os outros.

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    salary DECIMAL(10, 2)
);

INSERT INTO employees (id, name, salary) VALUES
  (1, 'John', 4500),
  (2, 'Jane', 5500),
  (3, 'Bob', 4000),
  (4, 'Alice', 6000);

UPDATE employees
SET salary = salary * 1.1
WHERE salary < 5000;