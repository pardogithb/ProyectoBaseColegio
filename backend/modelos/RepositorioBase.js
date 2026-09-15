const { sql, pool } = require('../db');

class RepositorioBase {
    constructor(nombreTabla) {
        this.nombreTabla = nombreTabla;
    }

    async listar() {
        const conexion = await pool;
        const resultado = await conexion.request()
            .query(`SELECT * FROM ${this.nombreTabla}`);
        return resultado.recordset;
    }

    async eliminar(id, nombreColumnaId) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM ${this.nombreTabla} WHERE ${nombreColumnaId} = @id`);
    }

    async insertar(datos) {
        throw new Error('El método insertar() debe implementarse en la clase hija');
    }

    async actualizar(id, datos) {
        throw new Error('El método actualizar() debe implementarse en la clase hija');
    }
}

module.exports = RepositorioBase;
