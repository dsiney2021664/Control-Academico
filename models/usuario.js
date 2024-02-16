const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    role:{
        type: String,
        required: true,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"]
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = model('Usuario', UsuarioSchema);