const Usuario = require('../models/usuario');
const Alumno = require('../models/alumno');
const Role = require('../models/role');
const Curso = require('../models/curso');

const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}

const existeUsuarioById = async (id = '') => {
    const existeUsuario = await Usuario.findOne({ id });
    if (existeUsuario) {
        throw new Error(`El usuario con el ${id} no existe`);
    }
}

const existeAlumnoById = async (id = '') => {
    const existeAlumno = await Alumno.findOne({ id });
    if (existeAlumno) {
        throw new Error(`El alumno con el ${id} no existe `);
    }
}

const existeCursoById = async (id = '') => {
    const existeCurso = await Curso.findOne({ id });
    if (existeCurso) {
        throw new Error(`El curso con el ${id} no existe `);
    }
}

const esRolValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`El role ${role} no existe en base de datos.`)
    }
}

module.exports = {
    existenteEmail,
    existeUsuarioById,
    existeAlumnoById,
    existeCursoById,
    esRolValido

}