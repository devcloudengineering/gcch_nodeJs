const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.js");
const ejs = require("ejs");
const path = require("path");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    console.log("MongoDB URI:", process.env.MONGODBCNN);
    console.log("Nodemail key GMAIL:", process.env.GMAILKEY);

    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.clientesPath = "/api/clientes";
    this.authPath = "/api/auth";
    this.nodemailerPath = "/api/nodemailer";
    this.anunciosPath = "/api/anuncios";

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
    // Configuración del motor de vistas EJS
    this.app.set("view engine", "ejs");
    // Configuracion para admitir archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  async conectarDB() {
    await dbConnection();
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios.js"));
    this.app.use(this.clientesPath, require("../routes/clientes.js"));
    this.app.use(this.authPath, require("../routes/auth.js"));
    this.app.use(this.nodemailerPath, require("../routes/nodemailer.js"));
    this.app.use(this.anunciosPath, require("../routes/anuncios.js"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor REST escuchando en el puerto", this.port);
    });
  }
}

module.exports = Server;
