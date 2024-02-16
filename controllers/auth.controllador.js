

const login = async (req, res) => {
    const { correo, password} = req.body;

    try{
        // Verificar que el correo exista
        const usuario = await Usuario
    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Comuniquese con el administrador'
        })
    }
}

module.exports = {
    login,
}