// Este archivo contiene las operaciones propias de la tabla estudiante.
// Hereda operaciones comunes de RepositorioBase y recibe datos desde routes/api.js.
// Usa la conexión de db.js para insertar y actualizar estudiantes en SQL Server.

// Reutiliza las operaciones comunes de la clase base.
const RepositorioBase = require('./RepositorioBase');
// Importa los tipos SQL y la conexión compartida.
const { sql, pool } = require('../db');

// Repositorio especializado en la tabla estudiante.
class EstudianteRepo extends RepositorioBase {
    constructor() {
        // Indica a la clase base qué tabla debe consultar.
        super('estudiante');
    }

    // Inserta el nombre y el grado de un estudiante.
    async insertar(datos) {
        const conexion = await pool;
        await conexion.request()
            .input('nombre', sql.VarChar, datos.nombre)
            .input('grado', sql.VarChar, datos.grado)
            .query('INSERT INTO estudiante (nombre, grado) VALUES (@nombre, @grado)');
    }

    // Cambia el nombre y el grado del estudiante indicado.
    async actualizar(id, datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, datos.nombre)
            .input('grado', sql.VarChar, datos.grado)
            .query('UPDATE estudiante SET nombre = @nombre, grado = @grado WHERE id_estudiante = @id');
    }
}

// Exporta el repositorio para usarlo desde las rutas y las pruebas.
module.exports = EstudianteRepo;
