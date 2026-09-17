import RepositorioBase from './RepositorioBase.js';
import { sql, pool } from '../db.js';

class EstudianteRepo extends RepositorioBase {
    constructor() {
        super('estudiante');
    }

    async insertar(datos) {
        const conexion = await pool;
        await conexion.request()
            .input('nombre', sql.VarChar, datos.nombre)
            .input('grado', sql.VarChar, datos.grado)
            .query('INSERT INTO estudiante (nombre, grado) VALUES (@nombre, @grado)');
    }

    async actualizar(id, datos) {
        const conexion = await pool;
        await conexion.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, datos.nombre)
            .input('grado', sql.VarChar, datos.grado)
            .query('UPDATE estudiante SET nombre = @nombre, grado = @grado WHERE id_estudiante = @id');
    }
}

export default EstudianteRepo;
