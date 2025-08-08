// routes/mocks.router.js
const express = require('express');
const router = express.Router();
const mockingController = require('../controllers/mocking.controller');

// Ruta para generar usuarios mockeados
router.get('/mockingusers', mockingController.generateMockUsers);

// Ruta para insertar datos generados en la base de datos
router.post('/generateData', mockingController.generateAndInsertData);

// Migración del endpoint /mockingpets
router.get('/mockingpets', mockingController.mockingPets);

module.exports = router;