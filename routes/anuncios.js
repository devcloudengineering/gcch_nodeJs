const { Router } = require("express");
const { check } = require("express-validator");
const {
  getAnuncio,
  postAnuncio,
  deleteAnuncio,
  putAnuncio,
} = require("../controllers/anuncios.js");
const { esRolValido, existeID } = require("../helpers/db-validators");

const {
  validarJWT,
  esAdminRole,
  tieneRols,
  validarCampos,
} = require("../middlewares");

const router = Router();

router.get("/", getAnuncio);

router.put(
  "/:id",
  [check("id", "El ID no es valido en la BD MongoDB").isMongoId()],
  validarCampos,
  putAnuncio
);
router.post("/", postAnuncio);

router.delete(
  "/:id",
  validarJWT,
  [check("id", "El ID no es valido en la BD MongoDB").isMongoId()],
  validarCampos,
  deleteAnuncio
);

module.exports = router;
