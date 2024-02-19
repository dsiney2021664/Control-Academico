const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Alumno = require('../models/alumno');
const Curso = require('../models/curso');

const obtenerAlumnoConCurso = async (alumnoId) => {
    try {
        const alumno = await Alumno.findById(alumnoId).populate('cursos');
        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }
        const nombreCurso = alumno.cursos ? alumno.cursos.nombre : null;
        return {
            ...alumno.toObject(),
            cursos: nombreCurso
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el alumno con el curso');
    }
}

const alumnosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, alumnos] = await Promise.all([
            Alumno.countDocuments(query),
            Alumno.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('cursos')
        ]);

        const cursosUncios = {};

        alumnos.forEach(alumno => {
            if (alumno.cursos && alumno.cursos.length  > 1) {
                const unicoCuso = new Set();
                alumno.cursos = alumno.cursos.filter(curso => {
                    if (unicoCuso.has(curso.nombre)) {
                        return false;
                    }
                    unicoCuso.add(curso.nombre);
                    return true
                })
            }
        })

        res.status(200).json({
            total,
            alumnos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener alumnos' });
    }

}

const getAlumnoByid = async (req, res) => {
    const { id } = req.params;
    const alumno = await obtenerAlumnoConCurso(id);

    res.status(200).json({
        alumno
    });
}

const alumnosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, correo, role, estado, ...resto } = req.body;

    try {
        const alumno = await Alumno.findById(id).populate('cursos');
        if (nombreCurso && alumno.cursos.some(curso => curso.nombre === nombreCurso)) {
            return res.status(400).json({
                msg: 'No te puedes asignar al mismo curso'
            });

        }
        await Alumno.findByIdAndUpdate(id, resto);

        const alumnoActualizado = await Alumno.findById({ _id: id });

        res.status(200).json({
            msg: 'Alumno Actualizado correctamente',
            alumno: alumnoActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al actualizar"
        })
    }

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
    const { nombre, apellido, correo, password, nombreCurso, role, estado } = req.body;
    const curso = await Curso.findOne({ nombre: nombreCurso });

    if (nombreCurso.length > 3) {
        return res.status(400).json({
            msg: 'No te puedes asignar a más de 3 cursos'
        });
    }

    if (!curso) {
        return res.status(400).json({ msg: 'Ingrese un curso valido' });
    }

    const cursos = await Curso.find({ nombre: { $in: nombreCurso } });
    if (cursos.lenght !== nombreCurso.lenght) {
        return res.status(400).json({
            msg: 'El curso no es valido'
        });
    }

    const alumno = new Alumno({ nombre, apellido, correo, password, role, estado });
    alumno.cursos = cursos.map(curso => curso._id);

    const salt = bcryptjs.genSaltSync();
    alumno.password = bcryptjs.hashSync(password, salt);

    await alumno.save();

    const cursoAsignado = await Curso.findById(curso._id);

    res.status(200).json({
        alumno,
        curso: cursoAsignado
    });
}

module.exports = {
    alumnosDelete,
    alumnosPost,
    alumnosGet,
    getAlumnoByid,
    alumnosPut
}