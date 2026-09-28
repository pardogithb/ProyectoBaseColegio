import RepositorioBase from './RepositorioBase.js';
import { sql, pool } from '../db.js';

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

    async calcularPromedioPorMateriaGeneral(grado) {
    const conexion = await pool;
    const peticion = conexion.request();

    let consulta = `
        SELECT m.id_materia, m.nombre, AVG(n.valor) AS promedio
        FROM nota n
        JOIN materia m ON n.id_materia = m.id_materia
        JOIN estudiante e ON n.id_estudiante = e.id_estudiante
    `;

    if (grado) {
        peticion.input('grado', sql.VarChar, grado);
        consulta += ' WHERE e.grado = @grado ';
    }

    consulta += ' GROUP BY m.id_materia, m.nombre ORDER BY promedio DESC';

    const resultado = await peticion.query(consulta);
    return resultado.recordset;
}
}

export default NotaRepo;