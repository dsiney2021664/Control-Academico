const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeAlumnoById } = require('../helpers/db-validator');

const { alumnosPost, alumnosGet, getAlumnoByid, alumnosPut, alumnosDelete } = require('../controllers/alumno.controller');

const router = Router();

router.get("/", alumnosGet);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato valido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ], getAlumnoByid);

router.put(
    "/:id",
    [
        check("id", "El id no es un formato valido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ], alumnosPut);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato valido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ], alumnosDelete);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("apellido", "El apellido es obligatorio").not().isEmpty(),
        check("correo", "Este no es un correo válido").isEmail(),
        check("correo").custom(existenteEmail),
        check("password", "El password debe ser mayor a 6 caracteres").isLength({ min: 6, }),
        check("cursos", "El curso es obligatorio").not().isEmpty(),
        validarCampos,
    ], alumnosPost);

module.exports = router;


