const RepositorioBase = require('./RepositorioBase');
const { sql, pool } = require('../db');

class NotaRepo extends RepositorioBase {
    constructor() {
        super('nota');
    }

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

    async actualizar(id, datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .input('valor', sql.Decimal(3, 1), datos.valor)
            .input('periodo', sql.Int, datos.periodo)
            .query('UPDATE nota SET valor = @valor, periodo = @periodo WHERE id_nota = @id');
    }

    async calcularPromedio(idEstudiante) {
        const conexion = await pool;
        const resultado = await conexion.request()
            .input('id_estudiante', sql.Int, idEstudiante)
            .query(`SELECT AVG(valor) AS promedio 
                    FROM nota 
                    WHERE id_estudiante = @id_estudiante`);
        return resultado.recordset[0].promedio;
    }

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

module.exports = NotaRepo;