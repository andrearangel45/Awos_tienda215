const express = require('express');
const { buscarCategoria } = require('../controllers/externalController');

const router = express.Router();

// Buscar categorías por texto
router.get('/buscar/:texto', buscarCategoria);

module.exports = router;
