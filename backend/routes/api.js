const express = require('express');
const router = express.Router();

const EstudianteRepo = require('../modelos/EstudianteRepo');
const MateriaRepo = require('../modelos/MateriaRepo');
const NotaRepo = require('../modelos/NotaRepo');

const estudianteRepo = new EstudianteRepo();
const materiaRepo = new MateriaRepo();
const notaRepo = new NotaRepo();

router.get('/estudiantes', async (req, res) => {
    const datos = await estudianteRepo.listar();
    res.json(datos);
});

router.post('/estudiantes', async (req, res) => {
    await estudianteRepo.insertar(req.body);
    res.json({ mensaje: 'Estudiante creado' });
});

router.put('/estudiantes/:id', async (req, res) => {
    await estudianteRepo.actualizar(req.params.id, req.body);
    res.json({ mensaje: 'Estudiante actualizado' });
});

router.delete('/estudiantes/:id', async (req, res) => {
    await estudianteRepo.eliminar(req.params.id, 'id_estudiante');
    res.json({ mensaje: 'Estudiante eliminado' });
});

router.get('/materias', async (req, res) => {
    const datos = await materiaRepo.listar();
    res.json(datos);
});

router.post('/materias', async (req, res) => {
    await materiaRepo.insertar(req.body);
    res.json({ mensaje: 'Materia creada' });
});

router.get('/notas', async (req, res) => {
    const datos = await notaRepo.listar();
    res.json(datos);
});

router.post('/notas', async (req, res) => {
    await notaRepo.insertar(req.body);
    res.json({ mensaje: 'Nota registrada' });
});

router.get('/notas/promedio/:idEstudiante', async (req, res) => {
    const promedio = await notaRepo.calcularPromedio(req.params.idEstudiante);
    res.json({ promedio });
});

module.exports = router;