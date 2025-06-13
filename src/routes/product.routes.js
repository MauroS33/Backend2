const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Rutas publicas
router.get('/products', productController.getAllProducts);

// Rutas protegidas
router.post('/products', isAdmin, productController.createProduct);
router.put('/products/:id', isAdmin, productController.updateProduct);
router.delete('/products/:id', isAdmin, productController.deleteProduct);

module.exports = router;