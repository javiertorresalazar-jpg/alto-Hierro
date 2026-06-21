-- =====================================================================
-- SQL TRAINER · Escenarios adicionales (Biblioteca y Hospital)
-- ---------------------------------------------------------------------
-- Pega este archivo en el SQL Editor de Supabase DESPUÉS de setup.sql
-- y pulsa "Run". Crea dos bases de datos nuevas (como "carpetas"/schemas)
-- que NO interfieren con la tienda.
-- =====================================================================

-- =====================================================================
-- ESCENARIO 2: BIBLIOTECA  (schema "biblioteca")
-- =====================================================================
DROP SCHEMA IF EXISTS biblioteca CASCADE;
CREATE SCHEMA biblioteca;

CREATE TABLE biblioteca.authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  country VARCHAR(80),
  birth_year INT
);

CREATE TABLE biblioteca.books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author_id INT REFERENCES biblioteca.authors(id),
  genre VARCHAR(60),
  year INT,
  copies INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2)
);

CREATE TABLE biblioteca.members (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  city VARCHAR(80),
  joined_at DATE NOT NULL
);

CREATE TABLE biblioteca.loans (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES biblioteca.members(id),
  book_id INT REFERENCES biblioteca.books(id),
  loaned_at DATE NOT NULL,
  returned_at DATE,
  status VARCHAR(20) DEFAULT 'activo' CHECK (status IN ('activo','devuelto','retrasado'))
);

INSERT INTO biblioteca.authors (name, country, birth_year) VALUES
  ('Gabriel García Márquez', 'Colombia', 1927),
  ('Isabel Allende', 'Chile', 1942),
  ('Miguel de Cervantes', 'España', 1547),
  ('Jorge Luis Borges', 'Argentina', 1899),
  ('Mario Vargas Llosa', 'Perú', 1936),
  ('Carlos Ruiz Zafón', 'España', 1964),
  ('Julio Cortázar', 'Argentina', 1914),
  ('Laura Esquivel', 'México', 1950),
  ('J.K. Rowling', 'Reino Unido', 1965),
  ('George Orwell', 'Reino Unido', 1903);

INSERT INTO biblioteca.books (title, author_id, genre, year, copies, price) VALUES
  ('Cien años de soledad', 1, 'Realismo mágico', 1967, 5, 19.90),
  ('El amor en los tiempos del cólera', 1, 'Romance', 1985, 3, 17.50),
  ('La casa de los espíritus', 2, 'Realismo mágico', 1982, 4, 18.00),
  ('Don Quijote de la Mancha', 3, 'Clásico', 1605, 6, 24.90),
  ('Ficciones', 4, 'Cuento', 1944, 2, 15.00),
  ('El Aleph', 4, 'Cuento', 1949, 2, 14.50),
  ('La ciudad y los perros', 5, 'Novela', 1963, 3, 16.90),
  ('La sombra del viento', 6, 'Misterio', 2001, 5, 21.00),
  ('Rayuela', 7, 'Novela', 1963, 2, 18.90),
  ('Como agua para chocolate', 8, 'Romance', 1989, 4, 16.00),
  ('Harry Potter y la piedra filosofal', 9, 'Fantasía', 1997, 8, 22.90),
  ('Harry Potter y la cámara secreta', 9, 'Fantasía', 1998, 6, 22.90),
  ('1984', 10, 'Distopía', 1949, 5, 14.90),
  ('Rebelión en la granja', 10, 'Sátira', 1945, 4, 12.90),
  ('Conversación en La Catedral', 5, 'Novela', 1969, 2, 19.50);

INSERT INTO biblioteca.members (first_name, last_name, email, city, joined_at) VALUES
  ('Elena', 'Ríos', 'elena.rios@email.com', 'Madrid', '2021-03-12'),
  ('Pablo', 'Mendoza', 'pablo.mendoza@email.com', 'Sevilla', '2020-06-05'),
  ('Sara', 'Ibáñez', 'sara.ibanez@email.com', 'Valencia', '2022-01-20'),
  ('Daniel', 'Cano', 'daniel.cano@email.com', 'Bilbao', '2019-11-30'),
  ('Marta', 'Gil', 'marta.gil@email.com', 'Madrid', '2023-02-14'),
  ('Iván', 'Prieto', 'ivan.prieto@email.com', 'Zaragoza', '2021-09-01'),
  ('Nuria', 'Lozano', 'nuria.lozano@email.com', 'Málaga', '2020-04-18'),
  ('Adrián', 'Santos', 'adrian.santos@email.com', 'Barcelona', '2022-07-22'),
  ('Cristina', 'Marín', 'cristina.marin@email.com', 'Granada', '2023-05-09'),
  ('Sergio', 'Herrero', 'sergio.herrero@email.com', 'Madrid', '2018-10-10');

INSERT INTO biblioteca.loans (member_id, book_id, loaned_at, returned_at, status) VALUES
  (1, 1, '2024-01-05', '2024-01-19', 'devuelto'),
  (2, 4, '2024-01-10', '2024-02-01', 'devuelto'),
  (3, 11, '2024-02-01', NULL, 'activo'),
  (1, 8, '2024-02-15', '2024-03-02', 'devuelto'),
  (4, 13, '2024-02-20', NULL, 'retrasado'),
  (5, 3, '2024-03-01', '2024-03-15', 'devuelto'),
  (6, 11, '2024-03-05', NULL, 'activo'),
  (7, 1, '2024-03-10', '2024-03-24', 'devuelto'),
  (2, 5, '2024-03-12', NULL, 'retrasado'),
  (8, 7, '2024-04-01', '2024-04-12', 'devuelto'),
  (9, 11, '2024-04-03', NULL, 'activo'),
  (1, 13, '2024-04-10', '2024-04-25', 'devuelto'),
  (10, 4, '2024-04-15', NULL, 'activo'),
  (3, 8, '2024-05-01', '2024-05-10', 'devuelto'),
  (5, 1, '2024-05-05', NULL, 'activo'),
  (6, 14, '2024-05-08', '2024-05-20', 'devuelto'),
  (4, 11, '2024-05-12', NULL, 'activo'),
  (7, 9, '2024-05-15', NULL, 'retrasado');

-- =====================================================================
-- ESCENARIO 3: HOSPITAL  (schema "hospital")
-- =====================================================================
DROP SCHEMA IF EXISTS hospital CASCADE;
CREATE SCHEMA hospital;

CREATE TABLE hospital.departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  floor INT
);

CREATE TABLE hospital.doctors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  specialty VARCHAR(80),
  department_id INT REFERENCES hospital.departments(id),
  salary DECIMAL(10,2)
);

CREATE TABLE hospital.patients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  birth_date DATE,
  city VARCHAR(80),
  blood_type VARCHAR(5)
);

CREATE TABLE hospital.appointments (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES hospital.patients(id),
  doctor_id INT REFERENCES hospital.doctors(id),
  appointment_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'programada' CHECK (status IN ('programada','completada','cancelada')),
  reason VARCHAR(150)
);

INSERT INTO hospital.departments (name, floor) VALUES
  ('Cardiología', 3),
  ('Pediatría', 1),
  ('Traumatología', 2),
  ('Neurología', 4),
  ('Dermatología', 1),
  ('Urgencias', 0);

INSERT INTO hospital.doctors (first_name, last_name, specialty, department_id, salary) VALUES
  ('Alicia', 'Vega', 'Cardióloga', 1, 78000),
  ('Roberto', 'Núñez', 'Cardiólogo', 1, 81000),
  ('Carla', 'Domínguez', 'Pediatra', 2, 65000),
  ('Manuel', 'Ortiz', 'Pediatra', 2, 63000),
  ('Patricia', 'Ramos', 'Traumatóloga', 3, 72000),
  ('Jorge', 'Cabrera', 'Neurólogo', 4, 88000),
  ('Lucía', 'Pascual', 'Neuróloga', 4, 85000),
  ('Fernando', 'Gallego', 'Dermatólogo', 5, 60000),
  ('Beatriz', 'León', 'Médica de urgencias', 6, 70000),
  ('Andrés', 'Vidal', 'Médico de urgencias', 6, 69000);

INSERT INTO hospital.patients (first_name, last_name, birth_date, city, blood_type) VALUES
  ('Tomás', 'Aguilar', '1985-04-12', 'Madrid', 'O+'),
  ('Carmen', 'Soto', '1992-09-23', 'Sevilla', 'A+'),
  ('Luis', 'Méndez', '1978-01-05', 'Valencia', 'B+'),
  ('Ana', 'Garrido', '2015-06-30', 'Bilbao', 'O-'),
  ('Diego', 'Fuentes', '1965-11-17', 'Madrid', 'AB+'),
  ('Rosa', 'Campos', '2018-03-08', 'Zaragoza', 'A-'),
  ('Javier', 'Rey', '1990-07-14', 'Málaga', 'O+'),
  ('Lucía', 'Crespo', '2001-12-01', 'Barcelona', 'B-'),
  ('Miguel', 'Bravo', '1955-02-28', 'Granada', 'A+'),
  ('Elena', 'Pardo', '1988-08-19', 'Madrid', 'O+'),
  ('Pablo', 'Marcos', '2010-05-21', 'Sevilla', 'AB-'),
  ('Sandra', 'Vázquez', '1973-10-09', 'Valencia', 'A+');

INSERT INTO hospital.appointments (patient_id, doctor_id, appointment_date, status, reason) VALUES
  (1, 1, '2024-01-15', 'completada', 'Revisión cardíaca'),
  (4, 3, '2024-01-20', 'completada', 'Control pediátrico'),
  (5, 1, '2024-02-01', 'completada', 'Dolor en el pecho'),
  (3, 5, '2024-02-10', 'completada', 'Fractura de muñeca'),
  (6, 4, '2024-02-14', 'cancelada', 'Vacunación'),
  (2, 8, '2024-02-20', 'completada', 'Erupción cutánea'),
  (7, 6, '2024-03-01', 'completada', 'Migrañas frecuentes'),
  (9, 2, '2024-03-05', 'programada', 'Seguimiento cardíaco'),
  (11, 3, '2024-03-10', 'completada', 'Fiebre'),
  (8, 7, '2024-03-15', 'completada', 'Mareos'),
  (1, 2, '2024-04-01', 'programada', 'Control de tensión'),
  (10, 9, '2024-04-05', 'completada', 'Urgencia - corte'),
  (12, 8, '2024-04-10', 'completada', 'Revisión de lunares'),
  (5, 6, '2024-04-15', 'programada', 'Consulta neurológica'),
  (4, 4, '2024-04-20', 'completada', 'Revisión de oído'),
  (6, 3, '2024-05-01', 'completada', 'Control pediátrico'),
  (3, 5, '2024-05-05', 'cancelada', 'Revisión de yeso'),
  (7, 10, '2024-05-10', 'completada', 'Urgencia - fiebre alta'),
  (2, 8, '2024-05-15', 'programada', 'Seguimiento dermatológico'),
  (9, 1, '2024-05-20', 'completada', 'Electrocardiograma');

-- ✅ Listo. Schemas "biblioteca" y "hospital" creados con sus datos.
