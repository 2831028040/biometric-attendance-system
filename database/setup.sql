-- Base de Datos: Sistema de Asistencia
CREATE DATABASE IF NOT EXISTS asistencia_db;
USE asistencia_db;

-- Tabla para Código de Barras
CREATE TABLE IF NOT EXISTS barcode_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presente TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para Código QR
CREATE TABLE IF NOT EXISTS qr_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presente TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para Reconocimiento de Voz
CREATE TABLE IF NOT EXISTS voice_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presente TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para Reconocimiento Facial
CREATE TABLE IF NOT EXISTS face_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presente TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT INTO barcode_scans (nombre, presente) VALUES
('Escaneo de Barras', 1),
('Escaneo de Barras', 1);

INSERT INTO qr_scans (nombre, presente) VALUES
('Escaneo QR', 1),
('Escaneo QR', 1);

INSERT INTO voice_scans (nombre, presente) VALUES
('Reconocimiento de Voz', 1),
('Reconocimiento de Voz', 1);

INSERT INTO face_scans (nombre, presente) VALUES
('Reconocimiento Facial', 1),
('Reconocimiento Facial', 1);
