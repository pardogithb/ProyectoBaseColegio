// Este archivo configura la conexión entre el backend y SQL Server.
// Es utilizado por los repositorios para ejecutar consultas en la base de datos.
// Exporta el cliente sql y la conexión pool para que otros archivos los reutilicen.

// Importa el cliente de SQL Server para crear consultas y conexiones.
const sql = require('mssql');

// Datos necesarios para conectarse a la base de datos del proyecto.
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

// Esta función abre la conexión usando async/await y devuelve el grupo de conexiones.
async function conectarBaseDatos() {
    try {
        // Espera hasta que SQL Server acepte la conexión.
        const conexion = await sql.connect(config);
        // Informa que la conexión está lista para ser utilizada por los repositorios.
        console.log('Conexión exitosa a SQL Server');
        return conexion;
    } catch (error) {
        // Muestra el motivo del fallo y mantiene el error para quien use la conexión.
        console.error('Error de conexión:', error);
        throw error;
    }
}

// Inicia una sola conexión y conserva la promesa para compartirla entre los repositorios.
const pool = conectarBaseDatos();

// Expone el cliente SQL y la conexión compartida al resto del backend.
module.exports = { sql, pool };