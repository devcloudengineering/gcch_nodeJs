const Role = require("../models/role");
const Usuario = require("../models/usuario.js");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

// Verificar si el correo existe
const existeEmail = async (correo = "") => {
  const email = await Usuario.findOne({ correo });
  if (email) {
    throw new Error(`El correo ${correo} ya esta registrado en la bbdd`);
  }
};

// Verificar si el id existe
const existeID = async (id = "") => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no esta registrado en la bbdd`);
  }
};

module.exports = {
  esRolValido,
  existeEmail,
  existeID,
};
