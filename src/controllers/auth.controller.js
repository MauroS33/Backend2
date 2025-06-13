const User = require('../models/user.model');
const { generateResetToken, sendResetEmail } = require('../utils/token.utils'); // Importar funciones de token
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserDTO = require('../dtos/user.dto'); // Importar el DTO

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Crear un nuevo usuario
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: '¡Registro exitoso! Ahora puedes iniciar sesión.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token al cliente
    res.status(200).json({ 
      message: '¡Inicio de sesión exitoso!', 
      token,
      redirectUrl: '/products' // URL a la que se redirigirá al usuario
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener el perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Transformar el usuario con el DTO
    const userDto = new UserDTO(user);

    // Enviar el DTO al cliente
    res.status(200).json(userDto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// Solicitar restablecimiento de contraseña
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar un token de restablecimiento
    const resetToken = generateResetToken(user._id);
    // Construir el enlace de restablecimiento
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Enviar el correo con el enlace
    await sendResetEmail(email, resetLink);

    res.status(200).json({ message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar restablecimiento de contraseña' });
  }
};

// Restablecer la contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ error: 'El token es inválido o ha expirado' });
    }

     // Buscar al usuario por ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que la nueva contraseña no sea igual a la anterior
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    // Actualizar la contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};