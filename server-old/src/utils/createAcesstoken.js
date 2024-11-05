const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Genera un token JWT con una duración de 1 día.
 * @param {Object} data - Datos para incluir en el token.
 * @returns {String} - Token JWT generado.
 */
function createAccess(data) {
    if (!process.env.JWT_SECRET) {
        console.error("Falta JWT_SECRET en las variables de entorno.");
        throw new Error("Falta JWT_SECRET en las variables de entorno.");
    }

    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log("Token generado:", token);
    return token;
}

module.exports = { createAccess };
