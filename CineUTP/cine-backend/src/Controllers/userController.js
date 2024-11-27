const User = require('../Models/user');
const bcrypt = require('bcryptjs');

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    console.log('Obteniendo perfil. ID de usuario:', req.user.id);
    
    const user = await User.findById(req.user.id)
      .select('-password')
      .lean();

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    console.log('Perfil encontrado:', user);
    res.json(user);
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ 
      msg: 'Error del servidor al obtener el perfil',
      error: err.message 
    });
  }
};

// Actualizar perfil del usuario
exports.updateProfile = async (req, res) => {
  try {
    console.log('Actualizando perfil. Datos recibidos:', req.body);
    
    const {
      nombre,
      email,
      password,
      telefono,
      preferencias
    } = req.body;

    // Buscar usuario y verificar que existe
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'El email ya está en uso' });
      }
    }

    // Construir objeto de actualización
    const updateData = {};

    // Actualizar campos básicos
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (telefono) updateData.telefono = telefono;

    // Actualizar preferencias
    if (preferencias) {
      updateData.preferencias = {
        ...user.preferencias, // Mantener preferencias existentes
        ...preferencias // Sobrescribir con nuevas preferencias
      };

      // Validar géneros si se proporcionan
      if (preferencias.generos) {
        updateData.preferencias.generos = Array.isArray(preferencias.generos) 
          ? preferencias.generos 
          : [preferencias.generos];
      }

      // Validar notificaciones
      if (typeof preferencias.notificaciones === 'boolean') {
        updateData.preferencias.notificaciones = preferencias.notificaciones;
      }

      // Validar idioma preferido
      if (preferencias.idiomaPref) {
        updateData.preferencias.idiomaPref = preferencias.idiomaPref;
      }
    }

    // Si se proporciona nueva contraseña, encriptarla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Actualizar usuario
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    console.log('Perfil actualizado:', user);
    res.json(user);
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ 
      msg: 'Error del servidor al actualizar el perfil',
      error: err.message 
    });
  }
};