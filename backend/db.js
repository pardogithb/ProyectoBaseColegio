import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carga las variables desde backend/.env sin importar desde qué carpeta se ejecute node.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

// Verifica que las variables obligatorias existan antes de intentar conectar.
const obligatorias = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const faltantes = obligatorias.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
    throw new Error(
        `Faltan variables de entorno: ${faltantes.join(', ')}. ` +
        'Copia backend/.env.example a backend/.env y completa los valores.'
    );
}

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};
async function conectarBaseDatos() {
    try {
        const conexion = await sql.connect(config);
        console.log('Conexión exitosa a SQL Server');
        return conexion;
    } catch (error) {
        console.error('Error de conexión:', error);
        throw error;
    }
}

const pool = conectarBaseDatos();

export { sql, pool };