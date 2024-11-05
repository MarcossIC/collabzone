const dotenv = require("dotenv");
const { auth } = require("express-openid-connect");

dotenv.config();

const authConfig = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.AUTH0_CLIENT_SECRET,
	baseURL: process.env.AUTH0_BASE_URL,
	clientID: process.env.AUTH0_CLIENT_ID,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

const entorno = {
	JWT_SECRET: process.env.JWT_SECRET,
	MAIL_USER: process.env.MAIL_USER,
	MAIL_PASS: process.env.MAIL_PASS,
};

module.exports = {
	authMiddleware: auth(authConfig),
	entorno,
};
