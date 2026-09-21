import express from 'express';
const router = express.Router();

import EstudianteRepo from '../modelos/EstudianteRepo.js';
import MateriaRepo from '../modelos/MateriaRepo.js';
import NotaRepo from '../modelos/NotaRepo.js';

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

router.put('/materias/:id', async (req, res) => {
    await materiaRepo.actualizar(req.params.id, req.body);
    res.json({ mensaje: 'Materia actualizada' });
});

router.delete('/materias/:id', async (req, res) => {
    await materiaRepo.eliminar(req.params.id, 'id_materia');
    res.json({ mensaje: 'Materia eliminada' });
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

router.get('/notas/promedio/:idEstudiante/materia/:idMateria', async (req, res) => {
    const promedio = await notaRepo.calcularPromedioPorMateria(
        req.params.idEstudiante,
        req.params.idMateria
    );
    res.json({ promedio });
});

export default router;