const API_URL = 'http://localhost:3000/api';

function llenarFiltroGradoPromedio(estudiantes) {
    const select = document.getElementById('filtroGradoPromedio');
    const gradoSeleccionado = select.value;
    const grados = [...new Set(estudiantes.map(est => est.grado).filter(Boolean))];

    select.innerHTML = '<option value="">-- Todos los cursos --</option>';
    grados.forEach(grado => {
        const opcion = document.createElement('option');
        opcion.value = grado;
        opcion.textContent = grado;
        select.appendChild(opcion);
    });

    if (grados.includes(gradoSeleccionado)) {
        select.value = gradoSeleccionado;
    }
}

async function cargarEstudiantes() {
    const respuesta = await fetch(`${API_URL}/estudiantes`);
    const estudiantes = await respuesta.json();
    llenarFiltroGradoPromedio(estudiantes);

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
            <td><button class="btn-eliminar" onclick="eliminarNota(${nota.id_nota})">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
    });
}

async function eliminarNota(id) {
    if (confirm('¿Seguro que quieres eliminar esta nota?')) {
        await fetch(`${API_URL}/notas/${id}`, { method: 'DELETE' });
        cargarNotas();
    }
}

document.querySelectorAll('.tab-btn').forEach(boton => {
    boton.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('activo'));
        document.querySelectorAll('.tab-contenido').forEach(contenido => contenido.classList.remove('activo'));

        boton.classList.add('activo');
        document.getElementById(boton.dataset.tab).classList.add('activo');

        if (boton.dataset.tab === 'tabNotas') {
            cargarNotas();
        }

        if (boton.dataset.tab === 'vistaPromedio') {
            cargarPromedioMaterias();
        }
    });
});

async function cargarPromedioMaterias() {
    const grado = document.getElementById('filtroGradoPromedio').value;
    const ruta = grado
        ? `${API_URL}/notas/promedio-materias?grado=${encodeURIComponent(grado)}`
        : `${API_URL}/notas/promedio-materias`;
    const respuesta = await fetch(ruta);
    const datos = await respuesta.json();

    const tbody = document.querySelector('#tablaPromedioMaterias tbody');
    tbody.innerHTML = '';

    datos.forEach(materia => {
        const fila = document.createElement('tr');
        const promedio = materia.promedio === null ? null : Number(materia.promedio);
        const promedioHtml = promedio === null
            ? 'Sin notas'
            : `<span class="nota ${promedio < 3 ? 'nota-baja' : 'nota-alta'}">${promedio.toFixed(1)}</span>`;
        fila.innerHTML = `
            <td>${materia.id_materia}</td>
            <td>${materia.nombre}</td>
            <td>${promedioHtml}</td>
            <td>${materia.cantidad}</td>
        `;

        tbody.appendChild(fila);
    });
}

document.getElementById('btnVerPromedioMaterias').addEventListener('click', cargarPromedioMaterias);

cargarNotas();