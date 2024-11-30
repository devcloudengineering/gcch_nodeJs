const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    // Verificar si el email existe

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // Si el usuario esta activo

    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado",
      });
    }

    // Verificar la contraseña

    const validarPass = bcryptjs.compareSync(
      password.toString(),
      usuario.password
    );

    if (!validarPass) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      status: "Login ok",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
