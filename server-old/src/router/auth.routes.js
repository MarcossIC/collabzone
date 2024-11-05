const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const router = express.Router();
const authConfig = require('../config/authConfig');
const { login, logout, profile, status } = require('../controller/auth.controller');

/**
 * @swagger
 * tags:
 *   - name: AuthGoogle
 *     description: Rutas relacionadas con autenticación y autorización usando Google
 */
/**
 * @openapi
 * /login:
 *   get:
 *     summary: Iniciar sesión con Google
 *     description: |
 *       Este endpoint permite autenticar al usuario mediante Google OAuth 2.0.  
 *       Una vez que el usuario inicia sesión, el servidor establece una **cookie** llamada **appSession** 
 *       que contiene el token de sesión. Esta cookie es utilizada para gestionar la sesión del usuario en el cliente.  
 *       **Nota para el frontend:**  
 *       La cookie `appSession` incluye el **token JWT** que será necesario para acceder a rutas protegidas como `/profile`.
 *     tags:
 *       - AuthGoogle
 *     responses:
 *       200:
 *         headers:
 *           Set-Cookie:
 *             description: La cookie **appSession** contiene el token de sesión.
 *             schema:
 *               type: string
 *               example: "appSession=11112222333344445555"
 *       401:
 *         description: No autorizado. Falló la autenticación con Google.
 */
router.get('/login', requiresAuth(), login);

/**
 * @openapi
 * /logout:
 *   get:
 *     summary: Cerrar sesión de Google
 *     description: |
 *       Este endpoint permite al usuario cerrar sesión solo si está autenticado con Google OAuth 2.0.  
 *       Al cerrar la sesión, el servidor elimina la cookie **appSession** del cliente para finalizar la sesión.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - AuthGoogle
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente. La cookie appSession ha sido eliminada.
 *         headers:
 *           Set-Cookie:
 *             description: La cookie **appSession** se borra al establecerse con un valor vacío y fecha expirada.
 *             schema:
 *               type: string
 *               example: "appSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax"
 *       401:
 *         description: No autorizado. El usuario no tiene una sesión activa.
 */
router.get('/logout', logout);

/**
 * @openapi
 * /auth:
 *   get:
 *     summary: Verifica el estado de autenticación
 *     description: |
 *       Este endpoint devuelve el estado de autenticación del usuario.  
 *       Si la cookie **appSession** es válida, indica que el usuario está autenticado.  
 *       De lo contrario, responde que el usuario no está autenticado.
 *     tags:
 *       - AuthGoogle
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de autenticación del usuario.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Logged in"
 *       401:
 *         description: Usuario no autenticado o sesión expirada.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Logged out"
 */
router.get('/', status);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario
 *     description: Devuelve la información del usuario autenticado. Este endpoint requiere que el usuario esté autenticado para acceder a su perfil.
 *     tags:
 *       - AuthGoogle
 *     security:
 *       - bearerAuth: []  # Si usas autenticación con token (Bearer Token)
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: "Orlando"
 *                 lastName:
 *                   type: string
 *                   example: "Cardenas Villegas"
 *                 email:
 *                   type: string
 *                   example: "orlandocardenas0107@gmail.com"
 *       401:
 *         description: Usuario no autenticado o sesión expirada.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 */
router.get('/profile', profile);



module.exports = router;
