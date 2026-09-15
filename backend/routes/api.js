// Este archivo define las direcciones de la API para estudiantes, materias y notas.
// Recibe peticiones desde app.js y usa los repositorios para consultar o cambiar datos.
// Devuelve respuestas JSON al frontend después de completar cada operación.

// Importa Express para crear un grupo independiente de rutas.
const express = require('express');
const router = express.Router();

// Importa los repositorios que contienen el acceso a cada tabla.
const EstudianteRepo = require('../modelos/EstudianteRepo');
const MateriaRepo = require('../modelos/MateriaRepo');
const NotaRepo = require('../modelos/NotaRepo');

// Crea una instancia reutilizable de cada repositorio.
const estudianteRepo = new EstudianteRepo();
const materiaRepo = new MateriaRepo();
const notaRepo = new NotaRepo();

// Devuelve todos los estudiantes almacenados.
router.get('/estudiantes', async (req, res) => {
    const datos = await estudianteRepo.listar();
    res.json(datos);
});

// Recibe los datos de un estudiante y lo guarda en la base de datos.
router.post('/estudiantes', async (req, res) => {
    await estudianteRepo.insertar(req.body);
    res.json({ mensaje: 'Estudiante creado' });
});

// Actualiza el estudiante cuyo identificador llega en la URL.
router.put('/estudiantes/:id', async (req, res) => {
    await estudianteRepo.actualizar(req.params.id, req.body);
    res.json({ mensaje: 'Estudiante actualizado' });
});

// Elimina el estudiante indicado por su identificador.
router.delete('/estudiantes/:id', async (req, res) => {
    await estudianteRepo.eliminar(req.params.id, 'id_estudiante');
    res.json({ mensaje: 'Estudiante eliminado' });
});

// Devuelve todas las materias registradas.
router.get('/materias', async (req, res) => {
    const datos = await materiaRepo.listar();
    res.json(datos);
});

// Registra una nueva materia usando los datos enviados por el cliente.
router.post('/materias', async (req, res) => {
    await materiaRepo.insertar(req.body);
    res.json({ mensaje: 'Materia creada' });
});

// Devuelve todas las notas con sus datos almacenados.
router.get('/notas', async (req, res) => {
    const datos = await notaRepo.listar();
    res.json(datos);
});

// Guarda una nota asociada a un estudiante, una materia y un periodo.
router.post('/notas', async (req, res) => {
    await notaRepo.insertar(req.body);
    res.json({ mensaje: 'Nota registrada' });
});

// Calcula y devuelve el promedio de todas las notas de un estudiante.
router.get('/notas/promedio/:idEstudiante', async (req, res) => {
    const promedio = await notaRepo.calcularPromedio(req.params.idEstudiante);
    res.json({ promedio });
});

// Entrega este conjunto de rutas para que server.js lo monte bajo /api.
module.exports = router;