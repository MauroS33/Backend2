const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate, isUser } = require('../middleware/auth.middleware');

// Ruta para obtener el carrito del usuario
router.get('/', authenticate, cartController.getCart);

// Ruta para agregar un producto al carrito
router.post('/add', isUser, cartController.addToCart); // Solo usuarios pueden agregar productos

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/update/:itemId', isUser, cartController.updateCartItem); // Solo usuarios pueden actualizar productos

// Ruta para eliminar un producto del carrito
router.delete('/remove/:itemId', isUser, cartController.removeFromCart); // Solo usuarios pueden eliminar productos

// Ruta para vaciar el carrito
router.delete('/clear', isUser, cartController.clearCart); // Solo usuarios pueden vaciar el carrito

// Ruta para comprar productos del carrito
router.post('/purchase', isUser, cartController.purchaseCart); // Solo usuarios

module.exports = router;