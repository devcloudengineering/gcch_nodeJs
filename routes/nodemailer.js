const { Router } = require("express");
const { check } = require("express-validator");
const { postNodemailer } = require("../controllers/nodemailer");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/",
  [
    check("correo", "El correo no es valido").isEmail(),
    check("correo", "El correo es obligatorio").not().isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("mensaje", "El mensaje es obligatorio").not().isEmpty(),
  ],
  validarCampos,
  postNodemailer
);

module.exports = router;
