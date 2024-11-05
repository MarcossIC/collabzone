const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, updateProfile, resetPassword, getProfile } = require("../controller/userController.js");
const { tokenMiddleware } = require("../middlewares/middleware.js");
const dotenv = require("dotenv")

dotenv.config({ path: "../.env"})
/**
 * @openapi
 * tags:
 *   - name: AuthCredentials
 *     description: Rutas relacionadas con autenticación y autorización
 */

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Este endpoint permite registrar un nuevo usuario. Verifica si el usuario ya está registrado y encripta la contraseña antes de guardar los detalles del usuario en la base de datos. También genera un token JWT para el usuario después del registro exitoso.
 *     tags:
 *       - AuthCredentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "TuPasswordSegura123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente y token generado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: El usuario ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario ya está registrado."
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.post("/register", register);

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Este endpoint permite a un usuario iniciar sesión utilizando su correo electrónico y contraseña. Verifica si el usuario existe y si la contraseña coincide. Si la autenticación es exitosa, genera un token JWT para el usuario.
 *     tags:
 *       - AuthCredentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado."  # o "Contraseña incorrecta."
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor."
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.post("/login", login);

/**
 * @openapi
 * /user/forgot-password:
 *   post:
 *     summary: Enviar correo de restablecimiento de contraseña
 *     description: Permite a un usuario enviar un correo para restablecer su contraseña. Verifica si el usuario existe y envía un enlace de restablecimiento de contraseña.
 *     tags:
 *       - AuthCredentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@gmail.com"
 *     responses:
 *       200:
 *         description: Correo de restablecimiento enviado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Correo de restablecimiento enviado."
 *       400:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       500:
 *         description: Error enviando el correo o en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error enviando el correo."
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.post("/forgot-password", forgotPassword);

/**
 * @openapi
 * /user/reset-password:
 *   post:
 *     summary: Restablecer contraseña
 *     description: Este endpoint permite a un usuario restablecer su contraseña utilizando un token de restablecimiento. El token debe ser válido y no haber expirado.
 *     tags:
 *       - AuthCredentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT enviado por correo para validar el restablecimiento.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: La nueva contraseña del usuario.
 *                 example: "nueva-contraseña-segura"
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña restablecida exitosamente"
 *       400:
 *         description: Token inválido o usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido o usuario no encontrado"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.post("/reset-password", resetPassword);

/**
 * @openapi
 * /user/profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     description: Este endpoint permite a los usuarios autenticados actualizar su perfil. Es necesario enviar el token de autenticación para validar la solicitud.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Define que se requiere autenticación mediante Bearer token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Primer nombre del usuario.
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 description: Apellido del usuario.
 *                 example: "Pérez"
 *               username:
 *                 type: string
 *                 description: Nombre de usuario.
 *                 example: "juanp"
 *               rol:
 *                 type: string
 *                 description: Rol del usuario en la plataforma.
 *                 example: "admin"
 *               profilePicture:
 *                 type: string
 *                 description: URL de la imagen de perfil del usuario.
 *                 example: "https://example.com/images/profile.jpg"
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 username:
 *                   type: string
 *                 rol:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *       401:
 *         description: No autorizado. El token es inválido o no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acceso no autorizado"
 *       500:
 *         description: Error en el servidor al actualizar el perfil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error actualizando el perfil"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.put("/profile", tokenMiddleware, updateProfile);
/**
 * @openapi
 * /user/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     description: Este endpoint permite obtener los datos del perfil del usuario autenticado utilizando un token Bearer en el encabezado de autorización.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # Autenticación requerida mediante Bearer token
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f18c2e77f4f9723d1f5678"
 *                 username:
 *                   type: string
 *                   example: "juanp"
 *                 firstName:
 *                   type: string
 *                   example: "Juan"
 *                 lastName:
 *                   type: string
 *                   example: "Pérez"
 *                 email:
 *                   type: string
 *                   example: "juanp@example.com"
 *                 profilePicture:
 *                   type: string
 *                   example: "https://example.com/images/profile.jpg"
 *                 rol:
 *                   type: string
 *                   example: "admin"
 *                 status:
 *                   type: string
 *                   enum: ["online", "busy", "disconnected"]
 *                   example: "online"
 *       401:
 *         description: No autorizado. Token inválido o no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No autorizado. Token inválido o no proporcionado."
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.get("/profile", tokenMiddleware, getProfile);

module.exports = router;
