let express = require('express');
let router = express.Router();
let bd = require('./bd');

// Validación de ID numérico 
function validarId(id) {
    const numero = Number(id);
    return Number.isInteger(numero) && numero > 0;
}

// Función auxiliar
function ejecutarConsulta(sql, params) {
    return new Promise((resolve, reject) => {
        bd.query(sql, params, (error, resultados) => {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

// Validación de los datos de un libro
function validarLibro(datos) {
    const errores = [];

    if (!datos.titulo || typeof datos.titulo !== 'string' || datos.titulo.trim() === '') {
        errores.push('El título es obligatorio y no puede estar vacío');
    }
    if (!datos.autor || typeof datos.autor !== 'string' || datos.autor.trim() === '') {
        errores.push('El autor es obligatorio y no puede estar vacío');
    }
    if (datos.precio === undefined || datos.precio === null || isNaN(datos.precio) || Number(datos.precio) <= 0) {
        errores.push('El precio debe ser un número mayor que 0');
    }
    if (datos.stock === undefined || datos.stock === null || isNaN(datos.stock) || Number(datos.stock) < 0 || !Number.isInteger(Number(datos.stock))) {
        errores.push('El stock debe ser un número entero no negativo');
    }
    return errores;
}



// GET /libros - Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const filas = await ejecutarConsulta('SELECT * FROM libros');
        res.json(filas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

// GET /libros/:id - Obtener un libro por ID
router.get('/:id', async (req, res) => {
    if (!validarId(req.params.id)) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }
    try {
        const filas = await ejecutarConsulta('SELECT * FROM libros WHERE id = ?', [req.params.id]);
        if (filas.length === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(filas[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
});

// POST /libros - Agregar un nuevo libro
router.post('/', async (req, res) => {
    try {
        const libro = {
            titulo: req.body.titulo,
            autor: req.body.autor,
            precio: req.body.precio,
            stock: req.body.stock
        };

        // Validar entrada
        const errores = validarLibro(libro);
        if (errores.length > 0) {
            return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
        }

        // Asegurar tipos numéricos
        libro.precio = Number(libro.precio);
        libro.stock = Number(libro.stock);

        const resultado = await ejecutarConsulta('INSERT INTO libros SET ?', libro);
        res.status(201).json({ mensaje: 'Libro agregado', id: resultado.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el libro' });
    }
});

// PUT /libros/:id - Modificar un libro
router.put('/:id', async (req, res) => {
    if (!validarId(req.params.id)) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }
    try {
        const libro = {
            titulo: req.body.titulo,
            autor: req.body.autor,
            precio: req.body.precio,
            stock: req.body.stock
        };

        // Validar entrada
        const errores = validarLibro(libro);
        if (errores.length > 0) {
            return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
        }

        libro.precio = Number(libro.precio);
        libro.stock = Number(libro.stock);

        const resultado = await ejecutarConsulta('UPDATE libros SET ? WHERE ?', [libro, { id: req.params.id }]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json({ mensaje: 'Libro modificado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar el libro' });
    }
});

// DELETE /libros/:id - Eliminar un libro
router.delete('/:id', async (req, res) => {
    if (!validarId(req.params.id)) {
        return res.status(400).json({ error: 'El ID debe ser un número entero positivo' });
    }
    try {
        const resultado = await ejecutarConsulta('DELETE FROM libros WHERE id = ?', [req.params.id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json({ mensaje: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
});

module.exports = router;