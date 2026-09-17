import sql from 'mssql';

const config = {
    user: 'usuario_java',
    password: 'Colegio2026!',
    server: 'localhost',
    database: 'ProyectoBaseColegio',
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