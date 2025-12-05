-- Base de Datos: Sistema de Asistencia
CREATE DATABASE IF NOT EXISTS asistencia_db;
USE asistencia_db;

-- Tabla de Asistencia
CREATE TABLE IF NOT EXISTS asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    metodo VARCHAR(20) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presente TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT INTO asistencia (codigo, metodo, presente) VALUES
('12345', 'barcode', 1),
('67890', 'qr', 1),
('ABC123', 'voice', 1);

