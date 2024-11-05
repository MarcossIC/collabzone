const entorno = require("../config/authConfig.js");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const User = require ('../persistencia/models/user.models.js');
const Emp = require('../persistencia/models/emp.models.js')

dotenv.config({
	path:'../.env'
})

exports.tokenMiddleware = async (req, res, next) => {
    const {token} = req.cookies
    //console.log(token);
    
    //console.log('Intentando decodificar el token: ', token);

    if (!token) {
        return res.status(401).json({ message: "Acceso no autorizado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(decoded.userId);
        if (!user) {
            // Convertir el empId del token a ObjectId para la búsqueda en MongoDB
            //const empId = new mongoose.Types.ObjectId(decoded.empId);
            let empresa = await Emp.findById(decoded.empId);

            if (!empresa) {
                return res.status(404).json({ message: "Usuario o empresa no encontrados" });
            }

            req.empresa = empresa; // Guardamos la empresa en el request.
        } else {
            req.user = user; // Guardamos el usuario en el request.
        }

        next();
    } catch (error) {
        console.error('Error al procesar el token: ', error);
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};