const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.js");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

    // DB conexion
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion

    this.routes();
  }

  middlewares() {
    // Cors
    this.app.use(cors());
    // Directorio publico
    this.app.use(express.static("public"));
    // Lectura y parseo
    this.app.use(express.json());
  }

  async conectarDB() {
    await dbConnection();
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios.js"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor REST escuchando en el puerto", this.port);
    });
  }
}

module.exports = Server;
