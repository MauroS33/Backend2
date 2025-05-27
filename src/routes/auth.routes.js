const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware'); // Importar el middleware

// Ruta para registrar usuarios
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authenticate, authController.getProfile); // Usar el middleware aquí

module.exports = router;