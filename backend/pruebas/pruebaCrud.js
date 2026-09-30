import EstudianteRepo from '../modelos/EstudianteRepo.js';
¡import NotaRepo from '../modelos/NotaRepo.js';

async function probar() {
    const estudianteRepo = new EstudianteRepo();
    const notaRepo = new NotaRepo();

    console.log('--- Listado de estudiantes ---');
    const estudiantes = await estudianteRepo.listar();
    console.log(estudiantes);

    console.log('--- Promedio del estudiante con id 1 ---');
    const promedio = await notaRepo.calcularPromedio(1);
    console.log('Promedio:', promedio);
}

probar();