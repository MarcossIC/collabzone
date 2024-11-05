const jwt = require('jsonwebtoken');

const verifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err); 
            }
            resolve(decoded);
        });
    });
};

module.exports = verifyAccessToken
;