// Este archivo contiene las operaciones propias de la tabla materia.
// Hereda operaciones comunes de RepositorioBase y recibe solicitudes desde routes/api.js.
// Usa la conexión de db.js para guardar y actualizar materias en SQL Server.

// Reutiliza el listado y la eliminación definidos en la clase base.
const RepositorioBase = require('./RepositorioBase');
// Importa los tipos SQL y la conexión compartida.
const { sql, pool } = require('../db');

// Repositorio encargado de la tabla materia.
class MateriaRepo extends RepositorioBase {
    constructor() {
        // Configura el nombre de la tabla para las operaciones heredadas.
        super('materia');
    }

    // Inserta el nombre de una materia nueva.
    async insertar(datos) {
        const conexion = await pool;
        await conexion.request()
            .input('nombre', sql.VarChar, datos.nombre)
            .query('INSERT INTO materia (nombre) VALUES (@nombre)');
    }

    // Actualiza el nombre de una materia existente.
    async actualizar(id, datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, datos.nombre)
            .query('UPDATE materia SET nombre = @nombre WHERE id_materia = @id');
    }
}

// Exporta el repositorio para las rutas y las pruebas.
module.exports = MateriaRepo;