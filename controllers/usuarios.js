const { response, request } = require("express");
const Usuario = require("../models/usuario.js");
const bcryptjs = require("bcryptjs");

const getUsuario = async (req = request, res = response) => {
  // parametros de query
  // const params = req.query;
  // http://localhost:3000/api/usuarios?q='Hola'&edad=27
  // parseo de query (parametros opcionales en get)
  //   {
  //     "ok": true,
  //     "msg": "get API - controlador",
  //     "params": {
  //         "q": "'Hola'",
  //         "edad": "27"
  //     }
  // }
  const params = req.query;
  const { limite = 5, desde = 0 } = params;
  const query = { estado: true };

  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite)); // cantidad de registros a mostrar a partir del desde
  // const total = await Usuario.countDocuments(query);

  // Para mayor rapidez y ejecutar las promesas de manera simultanea utilizamos lo siguiente

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    ok: true,
    msg: "get API - controlador",
    total,
    usuarios,
  });
};

const postUsuario = async (req, res = response) => {
  // const body =b req.body;
  const { nombre, correo, rol, password } = req.body;

  const usuario = new Usuario({ nombre, correo, rol, password });

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

  const usuario = await Usuario.findByIdAndUpdate(id, resto);
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

  // const usuario = await Usuario.findByIdAndDelete(id);
  // para mantener integridad de los datos se recomienda manejar un campo de estado que haga la distincion si esta activo o no el usuario, se esta forma solo filtramos los que tengan estado true
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.status(403).json({
    ok: true,
    msg: "delete API - controlador",
    usuario,
  });
};

module.exports = {
  getUsuario,
  deleteUsuario,
  patchUsuario,
  postUsuario,
  putUsuario,
};
