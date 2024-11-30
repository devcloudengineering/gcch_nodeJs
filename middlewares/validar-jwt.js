const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req, res = response, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }
  try {
    // Ocupamos try catch ya que verify puede reventar la aplicacion, importante en el catch poner el return para evitar que la API se caiga
    const { uid, exp } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Verificar expiracion del token
    if (Date.now() >= exp * 1000) {
      return res.status(401).json({ msg: "Token ha expirado" });
    }

    // Leer usuario autenticado
    const usuarioAutenticado = await Usuario.findById(uid);
    if (!usuarioAutenticado) {
      return res.status(401).json({
        msg: "Usuario no existe en la base de datos",
      });
    }

    // Enviar usuario autenticado a la request para que sus demas middleware puedan obtener informacion de el
    req.usuarioAutenticado = usuarioAutenticado;

    // Verificar si el uid tiene estado true, ya que debe estar activo para realizar operaciones de admin
    if (!usuarioAutenticado.estado) {
      return res.status(401).json({
        msg: "Token no valido - estado del usuario autenticado en false",
      });
    }
  } catch ({ message }) {
    return res.status(401).json({
      status: "Token no valido",
      message,
    });
  }

  next();
};

module.exports = {
  validarJWT,
};
