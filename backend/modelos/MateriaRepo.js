import RepositorioBase from './RepositorioBase.js';
import { sql, pool } from '../db.js';

class MateriaRepo extends RepositorioBase {
    constructor() {
        super('materia');
    }

    async insertar(datos) {
        const conexion = await pool;
        await conexion.request()
            .input('nombre', sql.VarChar, datos.nombre)
            .query('INSERT INTO materia (nombre) VALUES (@nombre)');
    }

    async actualizar(id, datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, datos.nombre)
            .query('UPDATE materia SET nombre = @nombre WHERE id_materia = @id');
    }
}

export default MateriaRepo;