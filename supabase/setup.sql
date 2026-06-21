-- =====================================================================
-- SQL TRAINER · Configuración completa para Supabase
-- ---------------------------------------------------------------------
-- Copia TODO este archivo y pégalo en el SQL Editor de Supabase,
-- luego pulsa "Run". Esto crea las tablas y carga los datos de ejemplo.
-- =====================================================================

-- Limpiar tablas si existen
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Departamentos
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100)
);

-- Empleados
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(10, 2),
  department_id INT REFERENCES departments(id)
);

-- Categorías de productos
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category_id INT REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'España',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items de pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- Reseñas
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  customer_id INT REFERENCES customers(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- DATOS DE EJEMPLO
-- =====================================================================

INSERT INTO departments (name, location) VALUES
  ('Tecnología', 'Madrid'),
  ('Ventas', 'Barcelona'),
  ('Marketing', 'Valencia'),
  ('Logística', 'Sevilla'),
  ('Atención al Cliente', 'Madrid');

INSERT INTO employees (first_name, last_name, email, hire_date, salary, department_id) VALUES
  ('Ana', 'García', 'ana.garcia@techstore.es', '2020-01-15', 52000, 1),
  ('Carlos', 'Martínez', 'carlos.martinez@techstore.es', '2019-03-10', 48000, 2),
  ('Laura', 'López', 'laura.lopez@techstore.es', '2021-06-01', 45000, 3),
  ('Pedro', 'Sánchez', 'pedro.sanchez@techstore.es', '2018-11-20', 61000, 1),
  ('María', 'Fernández', 'maria.fernandez@techstore.es', '2022-02-14', 39000, 5),
  ('Javier', 'González', 'javier.gonzalez@techstore.es', '2020-07-08', 55000, 4),
  ('Lucía', 'Díaz', 'lucia.diaz@techstore.es', '2023-01-09', 37000, 5),
  ('Miguel', 'Ruiz', 'miguel.ruiz@techstore.es', '2017-05-25', 70000, 1),
  ('Elena', 'Moreno', 'elena.moreno@techstore.es', '2021-09-15', 43000, 3),
  ('Tomás', 'Jiménez', 'tomas.jimenez@techstore.es', '2019-12-01', 50000, 2);

INSERT INTO categories (name, description) VALUES
  ('Portátiles', 'Ordenadores portátiles y laptops'),
  ('Smartphones', 'Teléfonos móviles inteligentes'),
  ('Tablets', 'Tabletas y iPads'),
  ('Accesorios', 'Periféricos y accesorios tecnológicos'),
  ('Audio', 'Auriculares, altavoces y equipos de sonido'),
  ('Monitores', 'Pantallas y monitores'),
  ('Gaming', 'Productos para videojuegos');

INSERT INTO products (name, description, price, stock, category_id) VALUES
  ('MacBook Pro 14"', 'Apple MacBook Pro con chip M3, 16GB RAM', 2199.99, 15, 1),
  ('Dell XPS 15', 'Intel Core i7, 32GB RAM, 1TB SSD', 1599.99, 8, 1),
  ('Lenovo ThinkPad X1', 'Business laptop ultraligero', 1299.99, 12, 1),
  ('iPhone 15 Pro', 'Apple iPhone 15 Pro 256GB', 1199.99, 25, 2),
  ('Samsung Galaxy S24', 'Android, 8GB RAM, 256GB', 899.99, 30, 2),
  ('Xiaomi 14', 'Procesador Snapdragon 8 Gen 3', 799.99, 20, 2),
  ('iPad Pro 12.9"', 'Apple iPad Pro con chip M2', 1099.99, 10, 3),
  ('Samsung Galaxy Tab S9', 'Tablet Android premium', 749.99, 18, 3),
  ('Logitech MX Master 3', 'Ratón inalámbrico profesional', 99.99, 50, 4),
  ('Sony WH-1000XM5', 'Auriculares noise cancelling', 349.99, 22, 5),
  ('AirPods Pro 2ª Gen', 'Auriculares inalámbricos Apple', 279.99, 35, 5),
  ('LG UltraWide 34"', 'Monitor ultrawide 3440x1440', 599.99, 7, 6),
  ('Dell 27" 4K', 'Monitor 4K IPS 60Hz', 449.99, 14, 6),
  ('PlayStation 5', 'Consola Sony PlayStation 5', 549.99, 5, 7),
  ('Nintendo Switch OLED', 'Consola híbrida Nintendo', 349.99, 20, 7),
  ('Teclado Mecánico Keychron K2', 'Teclado mecánico inalámbrico', 89.99, 40, 4),
  ('Cargador USB-C 100W', 'Cargador universal GaN', 49.99, 80, 4),
  ('SanDisk SSD 1TB', 'Disco duro externo SSD', 119.99, 45, 4),
  ('Sennheiser HD 650', 'Auriculares de referencia audiófilo', 299.99, 8, 5),
  ('ASUS ROG Monitor 27"', 'Gaming 1440p 165Hz', 399.99, 11, 7);

INSERT INTO customers (first_name, last_name, email, city, country) VALUES
  ('Rosa', 'Álvarez', 'rosa.alvarez@email.com', 'Madrid', 'España'),
  ('Luis', 'Torres', 'luis.torres@email.com', 'Barcelona', 'España'),
  ('Carmen', 'Romero', 'carmen.romero@email.com', 'Valencia', 'España'),
  ('Antonio', 'Navarro', 'antonio.navarro@email.com', 'Sevilla', 'España'),
  ('Isabel', 'Serrano', 'isabel.serrano@email.com', 'Zaragoza', 'España'),
  ('Raúl', 'Molina', 'raul.molina@email.com', 'Málaga', 'España'),
  ('Patricia', 'Ortega', 'patricia.ortega@email.com', 'Murcia', 'España'),
  ('Diego', 'Castro', 'diego.castro@email.com', 'Lisboa', 'Portugal'),
  ('Sofía', 'Ramos', 'sofia.ramos@email.com', 'Buenos Aires', 'Argentina'),
  ('Marco', 'Vargas', 'marco.vargas@email.com', 'Ciudad de México', 'México'),
  ('Valentina', 'Reyes', 'valentina.reyes@email.com', 'Madrid', 'España'),
  ('Andrés', 'Cruz', 'andres.cruz@email.com', 'Barcelona', 'España'),
  ('Natalia', 'Flores', 'natalia.flores@email.com', 'Bilbao', 'España'),
  ('Hugo', 'Morales', 'hugo.morales@email.com', 'Granada', 'España'),
  ('Claudia', 'Vega', 'claudia.vega@email.com', 'Santiago', 'Chile');

INSERT INTO orders (customer_id, status, total, created_at) VALUES
  (1, 'delivered', 2299.98, '2024-01-10'),
  (2, 'delivered', 899.99, '2024-01-15'),
  (3, 'shipped', 1449.98, '2024-02-01'),
  (4, 'delivered', 349.99, '2024-02-10'),
  (5, 'delivered', 99.99, '2024-02-20'),
  (1, 'processing', 279.99, '2024-03-05'),
  (6, 'delivered', 599.99, '2024-03-10'),
  (7, 'cancelled', 1199.99, '2024-03-15'),
  (8, 'delivered', 449.99, '2024-03-20'),
  (9, 'shipped', 349.99, '2024-04-01'),
  (10, 'pending', 89.99, '2024-04-05'),
  (2, 'delivered', 1099.99, '2024-04-10'),
  (11, 'delivered', 549.99, '2024-04-15'),
  (12, 'processing', 799.99, '2024-04-20'),
  (3, 'delivered', 299.99, '2024-05-01'),
  (13, 'delivered', 119.99, '2024-05-05'),
  (4, 'shipped', 1199.99, '2024-05-10'),
  (14, 'delivered', 399.99, '2024-05-15'),
  (5, 'delivered', 2199.99, '2024-05-20'),
  (15, 'pending', 49.99, '2024-05-25');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 2199.99), (1, 9, 1, 99.99),
  (2, 5, 1, 899.99),
  (3, 3, 1, 1299.99), (3, 16, 1, 89.99),
  (4, 15, 1, 349.99),
  (5, 9, 1, 99.99),
  (6, 11, 1, 279.99),
  (7, 12, 1, 599.99),
  (8, 4, 1, 1199.99),
  (9, 13, 1, 449.99),
  (10, 15, 1, 349.99),
  (11, 16, 1, 89.99),
  (12, 7, 1, 1099.99),
  (13, 14, 1, 549.99),
  (14, 6, 1, 799.99),
  (15, 19, 1, 299.99),
  (16, 18, 1, 119.99),
  (17, 4, 1, 1199.99),
  (18, 20, 1, 399.99),
  (19, 1, 1, 2199.99),
  (20, 17, 1, 49.99);

INSERT INTO reviews (product_id, customer_id, rating, comment) VALUES
  (1, 1, 5, 'Increíble rendimiento, vale cada euro'),
  (1, 5, 4, 'Muy bueno pero caro'),
  (4, 2, 5, 'El mejor iPhone hasta la fecha'),
  (5, 3, 4, 'Muy buen Android, la cámara es excelente'),
  (9, 5, 5, 'El mejor ratón que he tenido'),
  (10, 6, 5, 'Cancelación de ruido impresionante'),
  (11, 1, 4, 'Buena calidad de sonido y cómodos'),
  (14, 13, 5, 'La PS5 es fantástica'),
  (15, 4, 4, 'Switch OLED tiene una pantalla preciosa'),
  (7, 12, 5, 'iPad Pro es una maravilla para trabajar'),
  (3, 3, 3, 'Buen portátil pero la batería podría ser mejor'),
  (12, 7, 4, 'Monitor increíble para trabajar'),
  (6, 10, 4, 'Gran relación calidad precio'),
  (2, 14, 5, 'Dell XPS 15 es una bestia'),
  (19, 9, 5, 'Los mejores auriculares que he escuchado');

-- ✅ Listo. Tablas creadas y datos cargados.
