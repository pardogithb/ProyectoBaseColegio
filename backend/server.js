import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});