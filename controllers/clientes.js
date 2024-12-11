const { response, request } = require("express");
const Cliente = require("../models/cliente.js");
const bcryptjs = require("bcryptjs");

const getCliente = async (req = request, res = response) => {
  const query = { estado: true }; // En caso de recuperar solo los activos

  const [total, clientes] = await Promise.all([
    Cliente.countDocuments(query),
    Cliente.find(),
  ]);

  res.status(200).json({
    ok: true,
    msg: "get API - controlador",
    total,
    clientes,
  });
};

const postUsuario = async (req, res = response) => {
  // const body =b req.body;
  const { nombre, correo, rol, password } = req.body;

  const usuario = new Cliente({ nombre, correo, rol, password });

  // Encriptar la contraseña (hashearla), genSaltSync() recibe como argumento las vueltas
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en la base de datos
  await usuario.save();
  res.status(201).json({
    ok: true,
    msg: "post API - controlador",
    usuario,
  });
};

const putCliente = async (req, res = response) => {
  const { id } = req.params;
  const {
    cliente,
    rutcliente,
    razonsocial,
    rutempresa,
    domicilio,
    notificaciones,
    telefono,
    "representante(s)": representantes,
    estado,
  } = req.body;

  const clienteActualizado = await Cliente.findByIdAndUpdate(id, {
    cliente,
    rutcliente,
    razonsocial,
    rutempresa,
    domicilio,
    notificaciones,
    telefono,
    "representante(s)": representantes,
    estado,
  });

  if (!clienteActualizado) {
    res.status(401).json({
      ok: false,
      msg: "Cliente no encontrado en la base de datos",
    });
  }

  const clientes = await Cliente.find();
  res.status(200).json({
    ok: true,
    msg: "put API - controlador",
    clientes,
  });
};

const patchUsuario = (req, res = response) => {
  res.status(403).json({
    ok: true,
    msg: "patch API - controlador",
  });
};

const deleteCliente = async (req, res = response) => {
  const { id } = req.params;

  // Eliminacion logica
  const clienteEliminado = await Cliente.findByIdAndUpdate(id, {
    estado: false,
  });

  if (!clienteEliminado) {
    res.status(403).json({
      ok: false,
      msg: "Error al eliminar cliente en la base de datos, no existe",
    });
  }

  const [total, clientes] = await Promise.all([
    Cliente.countDocuments(),
    Cliente.find(),
  ]);

  res.status(200).json({
    ok: true,
    msg: "get API - controlador",
    total,
    clientes,
  });
};

module.exports = {
  getCliente,
  deleteCliente,
  patchUsuario,
  postUsuario,
  putCliente,
};
