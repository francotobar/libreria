CREATE DATABASE IF NOT EXISTS libreria;
USE libreria;

DROP TABLE IF EXISTS libros;

CREATE TABLE libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

INSERT INTO libros (titulo, autor, precio, stock) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 19.99, 10),
('El Principito', 'Antoine de Saint-Exupéry', 12.50, 25),
('1984', 'George Orwell', 15.00, 14),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 24.99, 5),
('Ficciones', 'Jorge Luis Borges', 18.20, 8);