const { request, response } = require('express');

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar un role si validar token'
            });
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(400).json({
                msg: `Esta consulta necesita un rol de la siguiente lista ${roles}`,
            });
        }
        next();
    };
};

module.exports = {
    tieneRole
}