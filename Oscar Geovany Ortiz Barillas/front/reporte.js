function obtenerReporte() {
    const reporte = document.getElementById('reporte').value;
    fetch(`http://localhost:3000/ejecutar_reporte/${reporte}`)
        .then(response => response.json())
        .then(data => {
            mostrarResultado(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('resultado').innerHTML = '<p>Error al obtener el reporte.</p>';
        });
}

function mostrarResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<h2>${data.reporte}</h2>`;

    if (data.usuarios.length === 0) {
        resultadoDiv.innerHTML += '<p>No hay datos disponibles.</p>';
        return;
    }

    let tabla = '<table border="1"><tr><th>ID</th><th>Nombre</th><th>Fecha</th><th>Teléfono</th><th>Correo</th><th>Estado</th></tr>';
    data.usuarios.forEach(usuario => {
        tabla += `<tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.fecha}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.estado || 'N/A'}</td>
        </tr>`;
    });
    tabla += '</table>';

    resultadoDiv.innerHTML += tabla;
}
