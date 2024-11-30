const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
  const usuario = req.usuarioAutenticado;
  if (!usuario) {
    return res.status(500).json({
      msg: "Usuario autenticado no existe",
    });
  }

  if (usuario.rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: "Usuario no tiene privilegios para efectuar esta operacion",
    });
  }

  next();
};

const tieneRols = (...roles) => {
  return (req, res = response, next) => {
    const usuario = req.usuarioAutenticado;
    if (!roles.includes(usuario.rol)) {
      return res.status(401).json({
        msg: `El usuario tiene rol ${usuario.rol} y debe contener los siguientes rol: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRols,
};
