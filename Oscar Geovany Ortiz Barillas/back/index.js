const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'OscarGeovanyOrtizBarillas'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

app.post('/guardar_usuario', (req, res) => {
    const { nombre, fecha, telefono, correo } = req.body;
    const nombreRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    const telefonoRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!nombre || !fecha || !telefono || !correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (!nombreRegex.test(nombre)) {
        return res.status(400).json({ error: 'El nombre solo puede contener letras' });
    }

    if (!telefonoRegex.test(telefono)) {
        return res.status(400).json({ error: 'El teléfono solo puede contener números' });
    }

    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El formato del correo es inválido' });
    }

    if (!fechaRegex.test(fecha)) {
        return res.status(400).json({ error: 'El formato de fecha debe ser dd-mm-YYYY' });
    }

    const fechaNacimiento = fecha.split('-').reverse().join('-'); 
    const edad = new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();

    if (edad < 18) {
        return res.status(400).json({ error: 'El usuario debe ser mayor de edad' });
    }

    const query = 'INSERT INTO usuario (nombre, fecha, telefono, correo, creacion, EstadoUsuarioId) VALUES (?, ?, ?, ?, NOW(), ?)';
    db.query(query, [nombre, fechaNacimiento, telefono, correo, 1], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al guardar el usuario' });
        }
        res.json({ id: result.insertId, mensaje: 'Usuario almacenado correctamente' });
    });
});

app.get('/ejecutar_reporte/:reporte', (req, res) => {
    const reporte = req.params.reporte;

    switch (reporte) {
        case 'todos_usuarios':
            obtenerTodosLosUsuarios(res);
            break;
        case 'usuarios_creados_hoy':
            obtenerUsuariosCreadosHoy(res);
            break;
        case 'usuarios_creados_ayer':
            obtenerUsuariosCreadosAyer(res);
            break;
        default:
            res.status(400).json({ error: 'Error inesperado. El reporte no existe.' });
    }
});

function obtenerTodosLosUsuarios(res) {
    const query = `
        SELECT u.*, e.titulo AS estado 
        FROM usuario u 
        JOIN EstadoUsuario e ON u.EstadoUsuarioId = e.id
    `;
    db.query(query, (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener usuarios.' });
        }
        res.json({ reporte: 'Todos los usuarios', usuarios: users });
    });
}

function obtenerUsuariosCreadosHoy(res) {
    const query = 'SELECT * FROM usuario WHERE DATE(creacion) = CURDATE()';
    db.query(query, (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener usuarios creados hoy.' });
        }
        res.json({ reporte: 'Usuarios creados hoy', usuarios: users });
    });
}

function obtenerUsuariosCreadosAyer(res) {
    const query = 'SELECT * FROM usuario WHERE DATE(creacion) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)';
    db.query(query, (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener usuarios creados ayer.' });
        }
        res.json({ reporte: 'Usuarios creados ayer', usuarios: users });
    });
}

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
