// routes/mocks.router.js
const express = require('express');
const router = express.Router();
const mockingController = require('../controllers/mocking.controller');

// Ruta para generar usuarios mockeados
router.get('/mockingusers', mockingController.generateMockUsers);

// Ruta para generar e insertar datos en la base de datos
router.post('/generateData', mockingController.generateAndInsertData);

// Ruta para listar productos generados (opcional)
router.get('/mockingproducts', mockingController.listMockProducts);

module.exports = router;