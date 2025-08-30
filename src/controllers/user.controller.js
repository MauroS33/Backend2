const User = require('../models/user.model');

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};