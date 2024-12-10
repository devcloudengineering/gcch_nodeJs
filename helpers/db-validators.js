const Role = require("../models/role");
const Cliente = require("../models/cliente.js");

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

// Verificar si el id existe
const existeID = async (id = "") => {
  const existeId = await Cliente.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no esta registrado en la bbdd`);
  }
};

module.exports = {
  esRolValido,
  existeID,
};
