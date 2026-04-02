const express = require('express');
const { poblarProductos, buscarProducto, buscarCategoria, obtenerProductos, buscarProductos, crearProducto } = require('../controllers/externalController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', obtenerProductos);
router.get('/obtener', obtenerProductos);
router.post('/poblar', poblarProductos);
router.get('/buscar', buscarProductos);
router.get('/buscar/:termino', buscarProducto);
router.get('/categoria/buscar/:termino', buscarCategoria);
router.post('/crear', authMiddleware, crearProducto);

module.exports = router;
