const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { login } = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check("password", "La password es obligatoria").not().isEmpty(),
    check("password", "La password no es valida").isLength({ min: 6 }),
  ],
  validarCampos,
  login
);

module.exports = router;
