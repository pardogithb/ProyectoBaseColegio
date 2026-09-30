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
                <button class="btn-editar" onclick="editarEstudiante(${est.id_estudiante}, '${est.nombre}', '${est.grado}')">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEstudiante(${est.id_estudiante})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
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
    cargarNotas();
});

document.getElementById('btnConsultarPromedio').addEventListener('click', async () => {
    const resultado = document.getElementById('resultadoPromedio');
    const id = document.getElementById('idEstudianteConsulta').value.trim();
    const idMateria = document.getElementById('idMateriaConsulta').value.trim();

    if (!id) {
        resultado.textContent = 'Escribe el ID del estudiante para consultar el promedio.';
        return;
    }

    const rutaPromedio = idMateria
        ? `/notas/promedio/${id}/materia/${idMateria}`
        : `/notas/promedio/${id}`;

    resultado.textContent = 'Consultando...';

    try {
        const respuesta = await fetch(`${API_URL}${rutaPromedio}`);

        if (!respuesta.ok) {
            resultado.textContent = `El servidor respondió con error ${respuesta.status}. Revisa la consola del backend.`;
            return;
        }

        const datos = await respuesta.json();

        if (datos.promedio === null || datos.promedio === undefined) {
            resultado.textContent = idMateria
                ? 'Ese estudiante no tiene notas registradas en esa materia.'
                : 'Ese estudiante no tiene notas registradas.';
        } else {
            resultado.textContent = `Promedio: ${Number(datos.promedio).toFixed(1)}`;
        }
    } catch (error) {
        resultado.textContent = 'No se pudo conectar con el servidor. Revisa que esté encendido en http://localhost:3000.';
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
                <button class="btn-editar" onclick="editarMateria(${mat.id_materia}, '${mat.nombre}')">Editar</button>
                <button class="btn-eliminar" onclick="eliminarMateria(${mat.id_materia})">Eliminar</button>
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

cargarEstudiantes();
cargarMaterias();

async function cargarNotas() {
    const [notas, estudiantes, materias] = await Promise.all([
        fetch(`${API_URL}/notas`).then(r => r.json()),
        fetch(`${API_URL}/estudiantes`).then(r => r.json()),
        fetch(`${API_URL}/materias`).then(r => r.json())
    ]);

    const nombreEstudiante = Object.fromEntries(estudiantes.map(e => [e.id_estudiante, e.nombre]));
    const nombreMateria = Object.fromEntries(materias.map(m => [m.id_materia, m.nombre]));

    const tbody = document.querySelector('#tablaNotas tbody');
    tbody.innerHTML = '';
    notas.forEach(nota => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${nota.id_nota}</td>
            <td>${nombreEstudiante[nota.id_estudiante] ?? nota.id_estudiante}</td>
            <td>${nombreMateria[nota.id_materia] ?? nota.id_materia}</td>
            <td><span class="nota ${nota.valor < 3 ? 'nota-baja' : 'nota-alta'}">${Number(nota.valor).toFixed(1)}</span></td>
            <td>${nota.periodo}</td>
        `;
        tbody.appendChild(fila);
    });
}

function mostrarVista(idVista) {
    document.querySelectorAll('.vista').forEach(vista => {
        vista.hidden = true;
    });
    document.getElementById(idVista).hidden = false;
    window.scrollTo(0, 0);

    if (idVista === 'menuPrincipal') {
        cargarResumen();
    }

    if (idVista === 'vistaNotas') {
        cargarNotas();
    }

    if (idVista === 'vistaPromedio') {
        cargarPromedioMaterias();
    }
}

async function cargarResumen() {
    try {
        const [estudiantes, materias, notas] = await Promise.all([
            fetch(`${API_URL}/estudiantes`).then(r => r.json()),
            fetch(`${API_URL}/materias`).then(r => r.json()),
            fetch(`${API_URL}/notas`).then(r => r.json())
        ]);

        document.getElementById('conteoEstudiantes').textContent =
            estudiantes.length === 1 ? '1 estudiante registrado' : `${estudiantes.length} estudiantes registrados`;
        document.getElementById('conteoMaterias').textContent =
            materias.length === 1 ? '1 materia registrada' : `${materias.length} materias registradas`;
        document.getElementById('conteoNotas').textContent =
            notas.length === 1 ? '1 nota registrada' : `${notas.length} notas registradas`;

        const materiasConNotas = new Set(notas.map(nota => Number(nota.id_materia))).size;
        document.getElementById('conteoPromedio').textContent =
            `${materiasConNotas} de ${materias.length} materias con notas`;
    } catch (error) {
        document.getElementById('conteoEstudiantes').textContent = 'Sin conexión con el servidor';
        document.getElementById('conteoMaterias').textContent = 'Sin conexión con el servidor';
        document.getElementById('conteoNotas').textContent = 'Sin conexión con el servidor';
        document.getElementById('conteoPromedio').textContent = 'Sin conexión con el servidor';
    }
}

document.querySelectorAll('[data-vista]').forEach(boton => {
    boton.addEventListener('click', () => mostrarVista(boton.dataset.vista));
});

document.querySelectorAll('[data-volver]').forEach(boton => {
    boton.addEventListener('click', () => mostrarVista('menuPrincipal'));
});

async function cargarPromedioMaterias() {
    const [notas, materias] = await Promise.all([
        fetch(`${API_URL}/notas`).then(r => r.json()),
        fetch(`${API_URL}/materias`).then(r => r.json())
    ]);

    const tbody = document.querySelector('#tablaPromedioMaterias tbody');
    tbody.innerHTML = '';

    materias.forEach(materia => {
        const notasMateria = notas.filter(nota => Number(nota.id_materia) === Number(materia.id_materia));
        const fila = document.createElement('tr');

        if (notasMateria.length === 0) {
            fila.innerHTML = `
                <td>${materia.id_materia}</td>
                <td>${materia.nombre}</td>
                <td>Sin notas</td>
                <td>0</td>
            `;
        } else {
            const suma = notasMateria.reduce((total, nota) => total + Number(nota.valor), 0);
            const promedio = suma / notasMateria.length;
            fila.innerHTML = `
                <td>${materia.id_materia}</td>
                <td>${materia.nombre}</td>
                <td><span class="nota ${promedio < 3 ? 'nota-baja' : 'nota-alta'}">${promedio.toFixed(1)}</span></td>
                <td>${notasMateria.length}</td>
            `;
        }

        tbody.appendChild(fila);
    });
}

cargarResumen();