const User = require('../models/user.model');
const Product = require('../models/product.model');
const { generateMockUsers } = require('../utils/mocking.module');

// Endpoint para generar usuarios mockeados
exports.generateMockUsers = (req, res) => {
  try {
    const users = generateMockUsers(50); // Generar 50 usuarios
    res.status(200).json({ message: 'Usuarios generados exitosamente', users });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar usuarios mockeados' });
  }
};

// Endpoint para generar e insertar datos en la base de datos
exports.generateAndInsertData = async (req, res) => {
  try {
    const { users: userCount, products: productCount } = req.body;

    // Validar parámetros
    if (!userCount || !productCount) {
      return res.status(400).json({ error: 'Los parámetros "users" y "products" son requeridos.' });
    }

    // Generar usuarios mockeados
    const mockUsers = generateMockUsers(userCount);

    // Insertar usuarios en la base de datos
    await User.insertMany(mockUsers);

    // Generar productos mockeados
    const mockProducts = Array.from({ length: productCount }, (_, i) => ({
      title: `Producto${i + 1}`,
      description: `Descripción del Producto${i + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
      stock: Math.floor(Math.random() * 50) + 10,
      category: ['remeras', 'buzos', 'pantalones', 'camisas', 'bermudas'][Math.floor(Math.random() * 5)],
    }));

    // Insertar productos en la base de datos
    await Product.insertMany(mockProducts);

    res.status(200).json({ message: 'Datos generados e insertados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar o insertar datos' });
  }
};

// Endpoint para listar productos mockeados
exports.listMockProducts = (req, res) => {
  try {
    const productCount = parseInt(req.query.count) || 10; // Número de productos a generar (por defecto 10)

    // Generar productos mockeados
    const mockProducts = Array.from({ length: productCount }, (_, i) => ({
      title: `Producto${i + 1}`,
      description: `Descripción del Producto${i + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
      stock: Math.floor(Math.random() * 50) + 10,
      category: ['remeras', 'buzos', 'pantalones', 'camisas', 'bermudas'][Math.floor(Math.random() * 5)],
    }));

    res.status(200).json({ message: 'Productos mockeados generados exitosamente', products: mockProducts });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar productos mockeados' });
  }
};