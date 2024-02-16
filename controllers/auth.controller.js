const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const bycryptjs = require('bcryptjs')

const login = async (req, res) => {
    const { correo, password} = req.body;

    try{
        // Verificar que el correo exista
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: 'El correo no esta registrado'
            })
        }

        // Verficar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            })
        }
        // Verficar que la contraseña sea correcta
        const validPassword = bycryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generarJWT(usuario.id);

        res.status(200).json({
            msg: 'Login ok',
            usuario,
            token
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Comuniquese con el administrador'
        });
    }
}

module.exports = {
    login,
}