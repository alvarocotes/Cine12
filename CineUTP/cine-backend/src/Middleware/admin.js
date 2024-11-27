module.exports = function(req, res, next) {
    // Verificar si el usuario existe y es admin
    if (!req.user || !req.user.isAdmin) {
      console.log('Intento de acceso admin denegado:', req.user);
      return res.status(403).json({ 
        msg: 'Acceso denegado - Se requieren permisos de administrador' 
      });
    }
    next();
  };