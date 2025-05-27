const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Ruta para obtener el carrito del usuario
router.get('/', authenticate, cartController.getCart);

// Ruta para agregar un producto al carrito
router.post('/add', authenticate, cartController.addToCart);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/update/:itemId', authenticate, cartController.updateCartItem);

// Ruta para eliminar un producto del carrito
router.delete('/remove/:itemId', authenticate, cartController.removeFromCart);

// Ruta para vaciar el carrito
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;