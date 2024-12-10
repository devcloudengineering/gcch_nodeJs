const { response, request } = require("express");
const Cliente = require("../models/cliente.js");
const bcryptjs = require("bcryptjs");

const getCliente = async (req = request, res = response) => {
  const query = { estado: true };

  const [total, clientes] = await Promise.all([
    Cliente.countDocuments(query),
    Cliente.find(query),
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

const putUsuario = async (req, res = response) => {
  // parametros de segmento
  // const id = req.params.id;
  //   http://localhost:3000/api/usuarios/27
  // {
  //     "ok": true,
  //     "msg": "put API - controlador",
  //     "id": "27"
  // }
  const { id } = req.params;
  const { password, google, correo, ...resto } = req.body;

  // TODO validar contra la base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Cliente.findByIdAndUpdate(id, resto);
  res.status(200).json({
    ok: true,
    msg: "put API - controlador",
    usuario,
  });
};

const patchUsuario = (req, res = response) => {
  res.status(403).json({
    ok: true,
    msg: "patch API - controlador",
  });
};

const deleteUsuario = async (req, res = response) => {
  const { id } = req.params;

  // const usuario = await Cliente.findByIdAndDelete(id);
  // para mantener integridad de los datos se recomienda manejar un campo de estado que haga la distincion si esta activo o no el usuario, se esta forma solo filtramos los que tengan estado true
  const usuario = await Cliente.findByIdAndUpdate(id, { estado: false });

  res.status(403).json({
    ok: true,
    msg: "delete API - controlador",
    usuario,
  });
};

module.exports = {
  getCliente,
  deleteUsuario,
  patchUsuario,
  postUsuario,
  putUsuario,
};
