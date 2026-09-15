// Este archivo inicia el servidor web del proyecto y prepara Express.
// Recibe las peticiones del frontend y las envía al conjunto de rutas de la API.
// También activa CORS y la lectura de datos enviados en formato JSON.

// Importa Express para crear el servidor HTTP.
const express = require('express');
// Permite que el frontend realice solicitudes desde otro origen o puerto.
const cors = require('cors');
// Importa todas las rutas de la API del sistema escolar.
const apiRoutes = require('./routes/api');

// Crea la aplicación principal de Express.
const app = express();

// Habilita solicitudes entre orígenes.
app.use(cors());
// Interpreta automáticamente los cuerpos de las solicitudes en formato JSON.
app.use(express.json());
// Publica las rutas escolares bajo el prefijo /api.
app.use('/api', apiRoutes);

// Puerto donde queda disponible el servidor.
const PUERTO = 3000;
// Inicia el servidor y confirma en consola la dirección de acceso.
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});