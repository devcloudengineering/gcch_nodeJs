const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req, res = response, next) => {
  const token = req.header("token");

  // Verificar si el token está presente
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    // Verificar el token
    const { uid, exp } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Verificar expiración del token
    if (Date.now() >= exp * 1000) {
      return res.status(401).json({
        msg: "Token ha expirado",
      });
    }

    // Buscar el usuario autenticado en la base de datos
    const usuarioAutenticado = await Usuario.findById(uid);

    // Validar si el usuario existe
    if (!usuarioAutenticado) {
      return res.status(404).json({
        msg: "Usuario no existe en la base de datos",
      });
    }

    // Verificar si el usuario está activo
    if (!usuarioAutenticado.estado) {
      return res.status(403).json({
        msg: "Token no válido - estado del usuario autenticado en false",
      });
    }

    // Adjuntar información del usuario a la solicitud
    req.usuarioAutenticado = usuarioAutenticado;
    req.IdUsuarioAutenticado = usuarioAutenticado.id;

    next(); // Continuar al siguiente middleware
  } catch (error) {
    // Manejar errores de verificación de token
    return res.status(401).json({
      msg: "Token no válido",
      error: error.message,
    });
  }
};

module.exports = {
  validarJWT,
};
