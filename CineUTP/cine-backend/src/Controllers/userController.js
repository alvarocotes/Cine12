const User = require('../models/User');

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar perfil del usuario
exports.updateProfile = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.telefono = telefono || user.telefono;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};