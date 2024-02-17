const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');

const alumnosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, alumnos] = await Promise.all([
        Alumno.countDocuments(query),
        Alumno.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        alumnos
    });
}

const getAlumnoByid = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findOne({ _id: id });

    res.status(200).json({
        alumno
    });
}

const alumnosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, correo, role, estado, ...resto } = req.body;

    await Alumno.findByIdAndUpdate(id, resto);

    const alumno = await Alumno.findOne({ _id: id });

    res.status(200).json({
        msg: 'Alumno Actualizado correctamente',
        alumno
    });
}

const alumnosDelete = async (req, res) => {
    const { id } = req.params;
    await Alumno.findByIdAndUpdate(id, { estado: false });

    const alumno = await Alumno.findOne({ _id: id });
    const alumnoAutenticado = req.alumno;

    res.status(200).json({
        msg: "Alumno a eliminar",
        alumno,
        alumnoAutenticado
    });
}

const alumnosPost = async (req, res) => {
    const { nombre, apellido, correo, password, cursos, role, estado} = req.body;
    const alumno = new Alumno({nombre, apellido,correo, password, cursos, role, estado});

    const salt = bcryptjs.genSaltSync();
    alumno.password = bcryptjs.hashSync(password, salt);

    await alumno.save();
    res.status(200).json({
        alumno
    });
}

module.exports = {
    alumnosDelete,
    alumnosPost,
    alumnosGet,
    getAlumnoByid,
    alumnosPut
}