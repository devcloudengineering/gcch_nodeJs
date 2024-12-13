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
  try {
    const {
      cliente,
      rutcliente,
      razonsocial,
      rutempresa,
      domicilio,
      notificaciones,
      telefono,
      representantes,
    } = req.body;

    // Validación básica
    if (!cliente || !rutcliente || !razonsocial) {
      return res.status(400).json({
        ok: false,
        msg: "Los campos cliente, rutcliente y razonsocial son obligatorios.",
      });
    }

    // Crear nueva instancia del cliente
    const usuario = new Cliente({
      cliente,
      rutcliente,
      razonsocial,
      rutempresa,
      domicilio,
      notificaciones,
      telefono,
      representantes,
    });

    // Guardar en la base de datos
    await usuario.save();

    // Consultar lista actualizada de clientes y el total
    const clientes = await Cliente.find();
    const total = await Cliente.countDocuments({ estado: true });

    // Respuesta exitosa
    res.status(201).json({
      ok: true,
      msg: "Cliente creado correctamente",
      clientes,
      total,
    });
  } catch (error) {
    console.error(error); // Log en servidor para depuración
    res.status(500).json({
      ok: false,
      msg: "Error al procesar la solicitud",
      error: error.message, // Detalle del error
    });
  }
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
    representantes,
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
    representantes,
    estado,
  });

  if (!clienteActualizado) {
    res.status(401).json({
      ok: false,
      msg: "Cliente no encontrado en la base de datos",
    });
  }

  const clientes = await Cliente.find();
  const total = await Cliente.countDocuments({ estado: true });
  res.status(200).json({
    ok: true,
    msg: "put API - controlador",
    total,
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
    Cliente.countDocuments({ estado: true }),
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
