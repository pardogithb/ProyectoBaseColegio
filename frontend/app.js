const API_URL = 'http://localhost:3000/api';

async function cargarEstudiantes() {
    const respuesta = await fetch(`${API_URL}/estudiantes`);
    const estudiantes = await respuesta.json();

    const tbody = document.querySelector('#tablaEstudiantes tbody');
    tbody.innerHTML = '';

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
     llenarFiltroGrados(estudiantes);
}

function llenarFiltroGrados(estudiantes) {
    const select = document.getElementById('filtroGradoPromedio');
    const gradosUnicos = [...new Set(estudiantes.map(est => est.grado))];

    select.innerHTML = '<option value="">-- Todos los cursos --</option>';
    gradosUnicos.forEach(grado => {
        const opcion = document.createElement('option');
        opcion.value = grado;
        opcion.textContent = grado;
        select.appendChild(opcion);
    });
}


document.getElementById('formEstudiante').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('estudianteId').value;
    const datos = {
        nombre: document.getElementById('nombreEstudiante').value,
        grado: document.getElementById('gradoEstudiante').value
    };

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

    document.getElementById('formEstudiante').reset();
    document.getElementById('estudianteId').value = '';
    cargarEstudiantes();
});

function editarEstudiante(id, nombre, grado) {
    document.getElementById('estudianteId').value = id;
    document.getElementById('nombreEstudiante').value = nombre;
    document.getElementById('gradoEstudiante').value = grado;
}

async function eliminarEstudiante(id) {
    if (confirm('¿Seguro que quieres eliminar este estudiante?')) {
        await fetch(`${API_URL}/estudiantes/${id}`, { method: 'DELETE' });
        cargarEstudiantes();
    }
}

document.getElementById('formNota').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        id_estudiante: document.getElementById('idEstudianteNota').value,
        id_materia: document.getElementById('idMateriaNota').value,
        valor: document.getElementById('valorNota').value,
        periodo: document.getElementById('periodoNota').value
    };

    await fetch(`${API_URL}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    document.getElementById('formNota').reset();
    alert('Nota registrada');
});

document.getElementById('btnConsultarPromedio').addEventListener('click', async () => {
    const id = document.getElementById('idEstudianteConsulta').value;
    const idMateria = document.getElementById('idMateriaConsulta').value;
    const rutaPromedio = idMateria
        ? `/notas/promedio/${id}/materia/${idMateria}`
        : `/notas/promedio/${id}`;
    const respuesta = await fetch(`${API_URL}${rutaPromedio}`);
    const datos = await respuesta.json();

    if (datos.promedio === null || datos.promedio === undefined) {
        document.getElementById('resultadoPromedio').textContent = 'Promedio: sin notas registradas';
    } else {
        document.getElementById('resultadoPromedio').textContent = `Promedio: ${datos.promedio}`;
    }
});

async function cargarMaterias() {
    const respuesta = await fetch(`${API_URL}/materias`);
    const materias = await respuesta.json();

    const tbody = document.querySelector('#tablaMaterias tbody');
    tbody.innerHTML = '';
    materias.forEach(mat => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${mat.id_materia}</td>
            <td>${mat.nombre}</td>
            <td>
                <button onclick="editarMateria(${mat.id_materia}, '${mat.nombre}')">Editar</button>
                <button onclick="eliminarMateria(${mat.id_materia})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    const select = document.getElementById('idMateriaNota');
    select.innerHTML = '<option value="">-- Selecciona una materia --</option>';
    materias.forEach(mat => {
        const opcion = document.createElement('option');
        opcion.value = mat.id_materia;
        opcion.textContent = mat.nombre;
        select.appendChild(opcion);
    });
}

document.getElementById('formMateria').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('materiaId').value;
    const datos = { nombre: document.getElementById('nombreMateria').value };

    if (id) {
        await fetch(`${API_URL}/materias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    } else {
        await fetch(`${API_URL}/materias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    }

    document.getElementById('formMateria').reset();
    document.getElementById('materiaId').value = '';
    cargarMaterias();
});

function editarMateria(id, nombre) {
    document.getElementById('materiaId').value = id;
    document.getElementById('nombreMateria').value = nombre;
}

async function eliminarMateria(id) {
    if (confirm('¿Seguro que quieres eliminar esta materia?')) {
        await fetch(`${API_URL}/materias/${id}`, { method: 'DELETE' });
        cargarMaterias();
    }
}
document.getElementById('btnVerPromedioMaterias').addEventListener('click', async () => {
    const grado = document.getElementById('filtroGradoPromedio').value;
    const ruta = grado
        ? `${API_URL}/notas/promedio-materias?grado=${grado}`
        : `${API_URL}/notas/promedio-materias`;

    const respuesta = await fetch(ruta);
    const materias = await respuesta.json();

    const tbody = document.querySelector('#tablaPromedioMaterias tbody');
    tbody.innerHTML = '';

    materias.forEach(mat => {
        let estado;
        if (mat.promedio >= 4.0) {
            estado = 'Buen desempeño';
        } else if (mat.promedio >= 3.0) {
            estado = 'Regular';
        } else {
            estado = 'Requiere refuerzo';
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${mat.nombre}</td>
            <td>${Number(mat.promedio).toFixed(1)}</td>
            <td>${estado}</td>
        `;
        tbody.appendChild(fila);
    });
});
document.querySelectorAll('.tab-btn').forEach(boton => {
    boton.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
        document.querySelectorAll('.tab-contenido').forEach(c => c.classList.remove('activo'));

        boton.classList.add('activo');
        document.getElementById(boton.dataset.tab).classList.add('activo');
    });
});

cargarEstudiantes();
cargarMaterias();