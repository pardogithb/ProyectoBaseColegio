// Este archivo contiene las operaciones propias de la tabla nota.
// Hereda operaciones comunes de RepositorioBase y recibe solicitudes desde routes/api.js.
// También calcula promedios usando los datos guardados en SQL Server.

// Reutiliza las operaciones generales de los repositorios.
const RepositorioBase = require('./RepositorioBase');
// Importa los tipos SQL y la conexión compartida.
const { sql, pool } = require('../db');

// Repositorio especializado en registrar y consultar notas.
class NotaRepo extends RepositorioBase {
    constructor() {
        // Configura la tabla que utilizarán las operaciones heredadas.
        super('nota');
    }

    // Inserta una nota asociada a un estudiante, una materia y un periodo.
    async insertar(datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id_estudiante', sql.Int, datos.id_estudiante)
            .input('id_materia', sql.Int, datos.id_materia)
            .input('valor', sql.Decimal(3, 1), datos.valor)
            .input('periodo', sql.Int, datos.periodo)
            .query(`INSERT INTO nota (id_estudiante, id_materia, valor, periodo) 
                    VALUES (@id_estudiante, @id_materia, @valor, @periodo)`);
    }

    // Actualiza el valor y el periodo de una nota existente.
    async actualizar(id, datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .input('valor', sql.Decimal(3, 1), datos.valor)
            .input('periodo', sql.Int, datos.periodo)
            .query('UPDATE nota SET valor = @valor, periodo = @periodo WHERE id_nota = @id');
    }

    // Calcula el promedio de todas las notas de un estudiante.
    async calcularPromedio(idEstudiante) {
        const conexion = await pool;
        const resultado = await conexion.request()
            .input('id_estudiante', sql.Int, idEstudiante)
            .query(`SELECT AVG(valor) AS promedio 
                    FROM nota 
                    WHERE id_estudiante = @id_estudiante`);
        return resultado.recordset[0].promedio;
    }

    // Calcula el promedio del estudiante filtrando también por materia.
    async calcularPromedioPorMateria(idEstudiante, idMateria) {
        const conexion = await pool;
        const resultado = await conexion.request()
            .input('id_estudiante', sql.Int, idEstudiante)
            .input('id_materia', sql.Int, idMateria)
            .query(`SELECT AVG(valor) AS promedio 
                    FROM nota 
                    WHERE id_estudiante = @id_estudiante AND id_materia = @id_materia`);
        return resultado.recordset[0].promedio;
    }
}

// Exporta el repositorio para utilizarlo desde la API y las pruebas.
module.exports = NotaRepo;