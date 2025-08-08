// utils/mocking.module.js
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Función para generar usuarios mockeados
function generateMockUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const role = Math.random() > 0.5 ? 'user' : 'admin'; // Rol aleatorio
    const user = {
      _id: uuidv4(), // ID único para cada usuario
      name: `User${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('coder123', 10), // Contraseña encriptada
      role,
      pets: [], // Array vacío de mascotas
    };
    users.push(user);
  }
  return users;
}

module.exports = { generateMockUsers };