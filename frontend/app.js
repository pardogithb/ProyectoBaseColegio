// Este archivo controla la interacción de la pantalla del sistema de notas.
// Envía y recibe información de routes/api.js mediante solicitudes fetch.
// También actualiza formularios, tablas y mensajes visibles para el usuario.

// Dirección base donde el backend publica la API escolar.
const API_URL = 'http://localhost:3000/api';

// Consulta los estudiantes y actualiza la tabla visible.
async function cargarEstudiantes() {
    const respuesta = await fetch(`${API_URL}/estudiantes`);
    const estudiantes = await respuesta.json();

    // Busca el cuerpo de la tabla y elimina las filas anteriores.
    const tbody = document.querySelector('#tablaEstudiantes tbody');
    tbody.innerHTML = '';

    // Crea una fila HTML por cada estudiante recibido.
    estudiantes.forEach(est => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${est.id_estudiante}</td>
            <td>${est.nombre}</td>
            <td>${est.grado}</td>
            <td>
                <button onclick="editarEstudiante(${est.id_estudiante}, '${est.nombre}', '${est.grado}')">Editar</button>
                <button onclick="eliminarEstudiante(${est.id_estudiante})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

    // Atiende el formulario tanto para crear como para editar estudiantes.
document.getElementById('formEstudiante').addEventListener('submit', async (e) => {
        // Evita que el navegador recargue la página al enviar el formulario.
    e.preventDefault();

        // Si existe, este valor identifica al estudiante que se está editando.
    const id = document.getElementById('estudianteId').value;
        // Reúne los valores escritos en los campos del formulario.
    const datos = {
        nombre: document.getElementById('nombreEstudiante').value,
        grado: document.getElementById('gradoEstudiante').value
    };

    // Usa PUT cuando hay un identificador; de lo contrario crea un registro con POST.
    if (id) {
        await fetch(`${API_URL}/estudiantes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    } else {
        await fetch(`${API_URL}/estudiantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    }

    // Limpia el formulario y refresca la tabla después de guardar.
    document.getElementById('formEstudiante').reset();
    document.getElementById('estudianteId').value = '';
    cargarEstudiantes();
});

// Carga los datos del estudiante seleccionado en el formulario para editarlos.
function editarEstudiante(id, nombre, grado) {
    document.getElementById('estudianteId').value = id;
    document.getElementById('nombreEstudiante').value = nombre;
    document.getElementById('gradoEstudiante').value = grado;
}

// Pide confirmación y elimina el estudiante mediante la API.
async function eliminarEstudiante(id) {
    if (confirm('¿Seguro que quieres eliminar este estudiante?')) {
        await fetch(`${API_URL}/estudiantes/${id}`, { method: 'DELETE' });
        cargarEstudiantes();
    }
}

// Envía una nueva nota al backend cuando se registra el formulario.
document.getElementById('formNota').addEventListener('submit', async (e) => {
    // Evita la recarga automática de la página.
    e.preventDefault();

    // Reúne la relación, el valor y el periodo de la nota.
    const datos = {
        id_estudiante: document.getElementById('idEstudianteNota').value,
        id_materia: document.getElementById('idMateriaNota').value,
        valor: document.getElementById('valorNota').value,
        periodo: document.getElementById('periodoNota').value
    };

    // Envía los datos al endpoint encargado de crear notas.
    await fetch(`${API_URL}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    // Deja el formulario listo para registrar otra nota.
    document.getElementById('formNota').reset();
    alert('Nota registrada');
});

// Consulta el promedio del estudiante indicado y lo muestra en pantalla.
document.getElementById('btnConsultarPromedio').addEventListener('click', async () => {
    // Obtiene el identificador escrito por el usuario.
    const id = document.getElementById('idEstudianteConsulta').value;
    const respuesta = await fetch(`${API_URL}/notas/promedio/${id}`);
    const datos = await respuesta.json();

    // Muestra un mensaje distinto dependiendo de si existe un promedio.
    if (datos.promedio === null || datos.promedio === undefined) {
        document.getElementById('resultadoPromedio').textContent = 'Promedio: sin notas registradas';
    } else {
        document.getElementById('resultadoPromedio').textContent = `Promedio: ${datos.promedio}`;
    }
});

// Consulta las materias y actualiza la tabla y la lista del formulario de notas.
async function cargarMaterias() {
    // Pide al backend la lista completa de materias.
    const respuesta = await fetch(`${API_URL}/materias`);
    const materias = await respuesta.json();

    // Limpia la tabla antes de agregar las materias recibidas.
    const tbody = document.querySelector('#tablaMaterias tbody');
    tbody.innerHTML = '';
    materias.forEach(mat => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${mat.id_materia}</td><td>${mat.nombre}</td>`;
        tbody.appendChild(fila);
    });

    // Llena el selector para que el usuario elija el nombre de la materia.
    const select = document.getElementById('idMateriaNota');
    select.innerHTML = '<option value="">-- Selecciona una materia --</option>';
    materias.forEach(mat => {
        const opcion = document.createElement('option');
        // El valor enviado al backend es el identificador de la materia.
        opcion.value = mat.id_materia;
        // El texto visible para el usuario es el nombre de la materia.
        opcion.textContent = mat.nombre;
        select.appendChild(opcion);
    });
}

// Cuando el usuario envía el formulario de materias, crea una materia nueva.
document.getElementById('formMateria').addEventListener('submit', async (e) => {
    // Evita que la página se recargue automáticamente.
    e.preventDefault();

    const datos = { nombre: document.getElementById('nombreMateria').value };

    await fetch(`${API_URL}/materias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    // Limpia el formulario y actualiza la tabla y el selector.
    document.getElementById('formMateria').reset();
    cargarMaterias();
});

// Carga la información inicial cuando se abre la página.
cargarEstudiantes();
cargarMaterias();