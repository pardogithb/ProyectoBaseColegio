// Importa el repositorio que consulta los estudiantes.
const EstudianteRepo = require('../modelos/EstudianteRepo');
// Importa el repositorio que calcula promedios.
const NotaRepo = require('../modelos/NotaRepo');

// Ejecuta consultas básicas para comprobar el acceso a datos.
async function probar() {
    // Crea los repositorios que se usarán en esta prueba manual.
    const estudianteRepo = new EstudianteRepo();
    const notaRepo = new NotaRepo();

    // Obtiene y muestra todos los estudiantes.
    console.log('--- Listado de estudiantes ---');
    const estudiantes = await estudianteRepo.listar();
    console.log(estudiantes);

    // Obtiene y muestra el promedio del estudiante con identificador 1.
    console.log('--- Promedio del estudiante con id 1 ---');
    const promedio = await notaRepo.calcularPromedio(1);
    console.log('Promedio:', promedio);
}

// Inicia la prueba manual.
probar();