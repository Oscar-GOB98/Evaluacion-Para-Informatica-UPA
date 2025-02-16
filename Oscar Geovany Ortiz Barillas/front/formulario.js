document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault();  

    const nombre = document.getElementById('nombre').value;
    const fecha = document.getElementById('fecha').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;

    const nombreRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    const telefonoRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!nombre || !fecha || !telefono || !correo) {
        alert('Todos los campos son obligatorios');
        return;
    }

    if (!nombreRegex.test(nombre)) {
        alert('El nombre solo puede contener letras');
        return;
    }

    if (!telefonoRegex.test(telefono)) {
        alert('El teléfono solo puede contener números');
        return;
    }

    if (!emailRegex.test(correo)) {
        alert('El formato del correo es inválido');
        return;
    }

    if (!fechaRegex.test(fecha)) {
        alert('El formato de fecha debe ser dd-mm-YYYY');
        return;
    }

    const requestData = {
        nombre: nombre,
        fecha: fecha,
        telefono: telefono,
        correo: correo
    };

    fetch('http://localhost:3000/guardar_usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje) {
            alert(data.mensaje); 
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar la solicitud');
    });
});
