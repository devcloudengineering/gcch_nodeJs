const validaJWT = require("./validar-jwt");
const validaRoles = require("./validar-roles");
const validaCampos = require("./validar-campos");

module.exports = {
  ...validaJWT,
  ...validaRoles,
  ...validaCampos,
};
