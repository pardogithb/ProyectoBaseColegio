// Este archivo contiene la clase base de los repositorios del proyecto.
// Sus clases hijas heredan el listado y la eliminación de registros.
// Usa la conexión definida en db.js para comunicarse con SQL Server.

// Importa los tipos de datos SQL y la conexión compartida.
const { sql, pool } = require('../db');

// Clase base con operaciones comunes para los repositorios del sistema.
class RepositorioBase {
    constructor(nombreTabla) {
        // Guarda el nombre de la tabla sobre la que trabajará el repositorio hijo.
        this.nombreTabla = nombreTabla;
    }

    // Consulta y devuelve todas las filas de la tabla configurada.
    async listar() {
        const conexion = await pool;
        const resultado = await conexion.request()
            .query(`SELECT * FROM ${this.nombreTabla}`);
        return resultado.recordset;
    }

    // Elimina una fila usando el nombre de su columna identificadora.
    async eliminar(id, nombreColumnaId) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM ${this.nombreTabla} WHERE ${nombreColumnaId} = @id`);
    }

    // Obliga a cada repositorio hijo a definir cómo inserta sus campos.
    async insertar(datos) {
        throw new Error('El método insertar() debe implementarse en la clase hija');
    }

    // Obliga a cada repositorio hijo a definir cómo actualiza sus campos.
    async actualizar(id, datos) {
        throw new Error('El método actualizar() debe implementarse en la clase hija');
    }
}

// Exporta la clase para que otros repositorios puedan heredarla.
module.exports = RepositorioBase;
