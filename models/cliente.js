const { Schema, model } = require("mongoose");

const ClienteSchema = Schema({
  cliente: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  rutcliente: {
    type: String,
    required: [true, "El rut es obligatorio"],
  },
  razonsocial: {
    type: String,
    required: [true, "La razon social es obligatoria"],
  },
  rutempresa: {
    type: String,
    required: [true, "El rut es obligatorio"],
  },
  domicilio: {
    type: String,
  },
  notificaciones: {
    type: String,
    default: "dacredo1@gmail.com",
  },
  telefono: {
    type: Number,
  },
  representantes: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

ClienteSchema.methods.toJSON = function () {
  const { __v, ...cliente } = this.toObject();
  return cliente;
};

// Mongoose le va añadir el prefijo "s" al nombre de la coleccion, en este caso si se le pone Usuario, mongoose le pondra como nombre a la coleccion "Usuarios"

module.exports = model("Cliente", ClienteSchema);
