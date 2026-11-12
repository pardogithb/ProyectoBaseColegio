import EstudianteRepo from '../EstudianteRepo.js';

async function probar() {
    const estudianteRepo = new EstudianteRepo();

    console.log('--- Listado de estudiantes ---');
    const estudiantes = await estudianteRepo.listar();
    console.log(estudiantes);
}

probar();