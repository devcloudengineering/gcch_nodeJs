const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsuario,
  postUsuario,
  deleteUsuario,
  patchUsuario,
  putUsuario,
} = require("../controllers/usuarios");
const {
  esRolValido,
  existeEmail,
  existeID,
} = require("../helpers/db-validators");

const {
  validarJWT,
  esAdminRole,
  tieneRols,
  validarCampos,
} = require("../middlewares");

const router = Router();

router.get("/", getUsuario);
router.put(
  "/:id",
  [
    check("id", "El ID no es valido en la BD MongoDB").isMongoId(),
    check("id").custom(existeID),
    check("rol").custom(esRolValido),
  ],
  validarCampos,
  putUsuario
);
router.post(
  "/",
  [
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(existeEmail),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password debe contener al menos 6 caracteres"
    ).isLength({ min: 6 }),
    // check("rol", "El rol no es valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolValido),
  ],
  validarCampos,
  postUsuario
);
router.delete(
  "/:id",
  validarJWT,
  esAdminRole,
  [
    check("id", "El ID no es valido en la BD MongoDB").isMongoId(),
    check("id").custom(existeID),
  ],
  tieneRols("ADMIN_ROLE", "OTROS_ROLE"),
  validarCampos,
  deleteUsuario
);
router.patch("/", patchUsuario);

module.exports = router;
