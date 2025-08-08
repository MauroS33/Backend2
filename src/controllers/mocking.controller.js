// controllers/mocking.controller.js
const User = require('../models/user.model');
const Pet = require('../models/pet.model');
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
    const { users: userCount, pets: petCount } = req.body;

    // Validar parámetros
    if (!userCount || !petCount) {
      return res.status(400).json({ error: 'Los parámetros "users" y "pets" son requeridos.' });
    }

    // Generar usuarios mockeados
    const mockUsers = generateMockUsers(userCount);

    // Insertar usuarios en la base de datos
    await User.insertMany(mockUsers);

    // Generar mascotas mockeadas
    const mockPets = Array.from({ length: petCount }, (_, i) => ({
      name: `Pet${i + 1}`,
      species: ['dog', 'cat', 'bird'][Math.floor(Math.random() * 3)],
      age: Math.floor(Math.random() * 10) + 1,
    }));

    // Insertar mascotas en la base de datos
    await Pet.insertMany(mockPets);

    res.status(200).json({ message: 'Datos generados e insertados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar o insertar datos' });
  }
};