const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener token del header
  const token = req.header('x-auth-token');

  // Verificar si no hay token
  if (!token) {
    console.log('No se proporcionó token');
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Token verificado, usuario:', req.user); // Debug
    next();
  } catch (err) {
    console.error('Error al verificar token:', err);
    res.status(401).json({ msg: 'Token no válido' });
  }
};