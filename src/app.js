require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cartRoutes = require('./routes/cart.routes');

const app = express();

// Middleware
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Servir archivos estáticos desde la carpeta 'public' en la raíz del proyecto
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta raíz: Renderizar la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Ruta para la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Ruta para la página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

// Rutas de productos
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

// Ruta para la página del carrito
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'cart.html'));
});
// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar o crear el carrito del usuario
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    // Calcular el precio total del carrito
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    res.status(200).json({ items: cart.items, totalPrice });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

const authRoutes = require('./routes/auth.routes');

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Usar las rutas del carrito
app.use('/api/cart', cartRoutes);

// Ruta para la página de productos
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'products.html'));
});

module.exports = app;