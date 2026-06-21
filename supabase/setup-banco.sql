-- =====================================================================
-- SQL TRAINER · Escenario adicional (Banco)
-- ---------------------------------------------------------------------
-- Pega este archivo en el SQL Editor de Supabase y pulsa "Run".
-- Crea una base de datos nueva (schema "banco") que NO interfiere
-- con los demás escenarios.
-- =====================================================================

DROP SCHEMA IF EXISTS banco CASCADE;
CREATE SCHEMA banco;

CREATE TABLE banco.branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  city VARCHAR(80) NOT NULL
);

CREATE TABLE banco.customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  city VARCHAR(80),
  joined_at DATE NOT NULL
);

CREATE TABLE banco.accounts (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES banco.customers(id),
  branch_id INT REFERENCES banco.branches(id),
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('corriente','ahorro')),
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  opened_at DATE NOT NULL
);

CREATE TABLE banco.transactions (
  id SERIAL PRIMARY KEY,
  account_id INT REFERENCES banco.accounts(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposito','retiro','transferencia')),
  amount DECIMAL(12,2) NOT NULL,
  created_at DATE NOT NULL
);

CREATE TABLE banco.loans (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES banco.customers(id),
  amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('activo','pagado','moroso')),
  granted_at DATE NOT NULL
);

INSERT INTO banco.branches (name, city) VALUES
  ('Oficina Central', 'Madrid'),
  ('Sucursal Diagonal', 'Barcelona'),
  ('Sucursal Centro', 'Valencia'),
  ('Sucursal Norte', 'Bilbao'),
  ('Sucursal Sur', 'Sevilla');

INSERT INTO banco.customers (first_name, last_name, email, city, joined_at) VALUES
  ('Lucía', 'Hernández', 'lucia.hernandez@email.com', 'Madrid', '2018-03-12'),
  ('Mateo', 'Gómez', 'mateo.gomez@email.com', 'Barcelona', '2019-07-01'),
  ('Sofía', 'Ruiz', 'sofia.ruiz@email.com', 'Valencia', '2020-01-20'),
  ('Daniel', 'Díaz', 'daniel.diaz@email.com', 'Bilbao', '2017-11-05'),
  ('Martina', 'Moreno', 'martina.moreno@email.com', 'Sevilla', '2021-05-18'),
  ('Hugo', 'Álvarez', 'hugo.alvarez@email.com', 'Madrid', '2016-09-30'),
  ('Valeria', 'Romero', 'valeria.romero@email.com', 'Barcelona', '2022-02-14'),
  ('Leo', 'Torres', 'leo.torres@email.com', 'Valencia', '2019-12-22'),
  ('Emma', 'Navarro', 'emma.navarro@email.com', 'Bilbao', '2020-08-08'),
  ('Pablo', 'Jiménez', 'pablo.jimenez@email.com', 'Sevilla', '2018-06-17'),
  ('Carla', 'Vega', 'carla.vega@email.com', 'Madrid', '2023-01-09'),
  ('Adrián', 'Castro', 'adrian.castro@email.com', 'Barcelona', '2021-10-25');

INSERT INTO banco.accounts (customer_id, branch_id, account_type, balance, opened_at) VALUES
  (1, 1, 'corriente', 3500.50, '2018-03-15'),
  (1, 1, 'ahorro', 12000.00, '2018-04-01'),
  (2, 2, 'corriente', 850.75, '2019-07-05'),
  (3, 3, 'ahorro', 5400.00, '2020-01-25'),
  (4, 4, 'corriente', 2200.00, '2017-11-10'),
  (4, 4, 'ahorro', 30000.00, '2018-01-01'),
  (5, 5, 'corriente', 150.25, '2021-05-20'),
  (6, 1, 'ahorro', 78000.00, '2016-10-05'),
  (7, 2, 'corriente', 4300.00, '2022-02-20'),
  (8, 3, 'corriente', 980.00, '2019-12-28'),
  (9, 4, 'ahorro', 15600.50, '2020-08-15'),
  (10, 5, 'corriente', 6700.00, '2018-06-20'),
  (11, 1, 'corriente', 320.00, '2023-01-15'),
  (12, 2, 'ahorro', 9100.00, '2021-11-01');

INSERT INTO banco.transactions (account_id, type, amount, created_at) VALUES
  (1, 'deposito', 1000.00, '2024-01-05'),
  (1, 'retiro', 200.00, '2024-01-10'),
  (1, 'transferencia', 500.00, '2024-02-01'),
  (2, 'deposito', 3000.00, '2024-01-15'),
  (3, 'retiro', 150.00, '2024-02-10'),
  (3, 'deposito', 400.00, '2024-02-20'),
  (4, 'deposito', 2000.00, '2024-03-01'),
  (5, 'retiro', 300.00, '2024-03-05'),
  (6, 'deposito', 5000.00, '2024-03-10'),
  (6, 'transferencia', 1200.00, '2024-03-15'),
  (8, 'deposito', 10000.00, '2024-04-01'),
  (8, 'retiro', 2000.00, '2024-04-10'),
  (9, 'deposito', 800.00, '2024-04-15'),
  (10, 'retiro', 120.00, '2024-04-20'),
  (11, 'deposito', 1500.00, '2024-05-01'),
  (12, 'transferencia', 600.00, '2024-05-05'),
  (12, 'deposito', 2500.00, '2024-05-10'),
  (1, 'deposito', 750.00, '2024-05-15'),
  (4, 'retiro', 500.00, '2024-05-20'),
  (7, 'deposito', 1800.00, '2024-05-25');

INSERT INTO banco.loans (customer_id, amount, interest_rate, status, granted_at) VALUES
  (1, 15000.00, 4.50, 'activo', '2022-06-01'),
  (2, 8000.00, 5.20, 'pagado', '2020-09-15'),
  (3, 25000.00, 3.90, 'activo', '2023-01-10'),
  (4, 50000.00, 4.10, 'activo', '2021-03-20'),
  (5, 3000.00, 6.50, 'moroso', '2022-11-05'),
  (6, 120000.00, 3.50, 'activo', '2019-07-01'),
  (8, 10000.00, 5.00, 'pagado', '2021-05-12'),
  (10, 18000.00, 4.75, 'moroso', '2020-02-28'),
  (11, 5000.00, 6.00, 'activo', '2023-08-14'),
  (12, 30000.00, 4.00, 'pagado', '2022-04-19');
