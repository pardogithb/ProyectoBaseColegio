-- =====================================================
-- Script de creacion de la base de datos ProyectoBaseColegio
-- Ejecutar completo en SQL Server Management Studio (SSMS)
-- =====================================================

CREATE DATABASE ProyectoBaseColegio;
GO

USE ProyectoBaseColegio;
GO

-- ===== TABLAS =====

CREATE TABLE estudiante (
    id_estudiante INT IDENTITY(1,1) PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    grado         VARCHAR(20) NOT NULL
);

CREATE TABLE materia (
    id_materia INT IDENTITY(1,1) PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL
);

CREATE TABLE nota (
    id_nota       INT IDENTITY(1,1) PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_materia    INT NOT NULL,
    valor         DECIMAL(3,1) NOT NULL CHECK (valor BETWEEN 0.0 AND 5.0),
    periodo       INT NOT NULL,
    CONSTRAINT FK_nota_estudiante FOREIGN KEY (id_estudiante)
        REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
    CONSTRAINT FK_nota_materia FOREIGN KEY (id_materia)
        REFERENCES materia(id_materia) ON DELETE CASCADE
);
GO

-- ===== DATOS DE PRUEBA =====

INSERT INTO estudiante (nombre, grado) VALUES
('Juan Perez', '10-B'),
('alejandro', '10-B'),
('Daniel', '11-A');

INSERT INTO materia (nombre) VALUES
('Matematicas'),
('Espanol'),
('Ciencias'),
('Fisica');

INSERT INTO nota (id_estudiante, id_materia, valor, periodo) VALUES
(1, 1, 4.5, 1),
(1, 2, 3.8, 1),
(1, 1, 4.0, 2),
(1, 1, 3.0, 1);
GO

-- =====================================================
-- Habilitar autenticacion mixta (usuario y contrasena)
-- IMPORTANTE: hacer esto ANTES de ejecutar el bloque de abajo
--   1. Clic derecho sobre el servidor en SSMS -> Properties -> Security
--   2. Seleccionar "SQL Server and Windows Authentication mode"
--   3. Reiniciar el servicio de SQL Server (clic derecho -> Restart)
-- =====================================================

USE master;
GO
CREATE LOGIN usuario_java WITH PASSWORD = 'Colegio2026!';
GO
USE ProyectoBaseColegio;
GO
CREATE USER usuario_java FOR LOGIN usuario_java;
GO
ALTER ROLE db_owner ADD MEMBER usuario_java;
GO
