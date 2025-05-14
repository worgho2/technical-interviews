-- 2.6 Criação e Consulta de uma VIEW
--
-- Dada a tabela:
-- 
-- transactions 
-- id (INT)
-- account_id (INT)
-- transaction_date (DATE)
-- amount (DECIMAL)
--
-- Crie uma view chamada monthly_summary que mostre o account_id, o mês
-- (extraído de transaction_date), e o valor total das transações (soma de amount) agrupado por
-- account_id e mês. Em seguida, escreva uma query para listar os resumos mensais apenas para contas
-- que tiveram transações superiores a 10.000 em pelo menos um mês.

DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  id INT PRIMARY KEY,
  account_id INT,
  transaction_date DATE,
  amount DECIMAL
);

INSERT INTO transactions (id, account_id, transaction_date, amount) VALUES
(1, 1, '2023-01-01', 1000),
(2, 1, '2023-01-15', 2000),
(3, 2, '2023-02-01', 1500),
(4, 2, '2023-02-15', 2500),
(5, 3, '2023-03-01', 3000),
(6, 3, '2023-03-15', 3500),
(7, 4, '2023-04-01', 4000),
(8, 4, '2023-04-15', 4500),
(9, 5, '2023-05-01', 5000),
(10, 5, '2023-05-15', 5500),
(11, 6, '2023-06-01', 6000),
(12, 6, '2023-06-15', 6500),
(13, 7, '2023-07-01', 7000),
(14, 7, '2023-07-15', 7500),
(15, 8, '2023-08-01', 8000),
(16, 8, '2023-08-15', 8500),
(17, 9, '2023-09-01', 9000),
(18, 9, '2023-09-15', 9500),
(19, 10, '2023-10-01', 10000),
(20, 10, '2023-10-15', 10500),
(21, 11, '2023-11-01', 11000),
(22, 11, '2023-11-15', 11500),
(23, 12, '2023-12-01', 12000),
(24, 12, '2023-12-15', 12500);

DROP VIEW IF EXISTS monthly_summary;

CREATE VIEW monthly_summary AS
SELECT account_id, strftime('%m', transaction_date) AS month, SUM(amount) AS total_amount
FROM transactions
GROUP BY account_id, month;