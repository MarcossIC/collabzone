const { registerEmp, 
        loginEmp, 
        confirmEmail,
        sendResetPasswordEmail, 
        resetPassword, 
        createPermissions, 
        assignUPermissions,
        assignRPermissions, 
        viewusers,
        pview,
        pdelete } = require('../controller/emp.controller.js');
const express = require('express');
const router = express.Router();
const { tokenMiddleware } = require('../middlewares/middleware.js');


/**
 * @swagger
 * tags:
 *   - name: Empresa
 *     description: Operaciones relacionadas con los empresas, incluyendo registro, inicio de sesión, y restablecimiento de contraseña.
 */

/**
 * @swagger
 * /emp/register:
 *   post:
 *     tags: [Empresa]
 *     summary: Registra un nuevo empresa
 *     description: Registra un nuevo empresa, enviando un correo de confirmación de cuenta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 description: Dominio de la empresa del empresa.
 *               name:
 *                 type: string
 *                 description: Nombre del empresa.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del empresa.
 *               password:
 *                 type: string
 *                 description: Contraseña para la cuenta.
 *     responses:
 *       201:
 *         description: Registro exitoso, se envía un correo de confirmación.
 *       409:
 *         description: El nombre o el correo ya están en uso.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/register', registerEmp);

/**
 * @swagger
 * /emp/login:
 *   post:
 *     tags: [Empresa]
 *     summary: Inicia sesión como empresa
 *     description: Esta ruta permite que un empresa inicie sesión con su email y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       401:
 *         description: Credenciales inválidas.
 *       409:
 *         description: Email no registrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/login', loginEmp);

/**
 * @swagger
 * /emp/confirmemail:
 *   post:
 *     tags: [Empresa]
 *     summary: Confirma el correo electrónico
 *     description: Verifica el token de confirmación de correo y activa la cuenta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo verificado con éxito.
 *       400:
 *         description: Token inválido o expirado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/confirmemail', confirmEmail);

/**
 * @swagger
 * /emp/sendresetpasswordemail:
 *   post:
 *     tags: [Empresa]
 *     summary: Envía un enlace para restablecer la contraseña
 *     description: Envía un correo electrónico con un enlace para que el usuario restablezca su contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enlace de restablecimiento enviado al correo electrónico.
 *       404:
 *         description: Email no registrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/sendresetpasswordemail', sendResetPasswordEmail);

/**
 * @swagger
 * /emp/resetpassword:
 *   post:
 *     tags: [Empresa]
 *     summary: Restablece la contraseña
 *     description: Permite al usuario restablecer su contraseña usando el token proporcionado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito.
 *       400:
 *         description: Token inválido o expirado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/resetpassword', resetPassword);
/**
 * @swagger
 * /emp/createPermissions:
 *   post:
 *     tags: [Empresa]
 *     summary: Crear o agregar permisos al empleado
 *     description: Este endpoint permite a un empleado autenticado agregar permisos a su perfil. Si el permiso ya existe, se devuelve un error.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: string
 *                 description: El permiso que deseas agregar al empleado.
 *                 example: "edit_documents"
 *     responses:
 *       200:
 *         description: Permiso agregado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permissions created"
 *                 user:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de permisos del empleado después de la actualización.
 *                   example: ["edit_documents", "view_reports"]
 *       400:
 *         description: El permiso ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission already exists"
 *       404:
 *         description: Token inválido o empleado inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "token invalid o nonexistent emp"
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
 */
router.post('/createPermissions', tokenMiddleware, createPermissions);
/**
 * @swagger
 * /emp/assignRPermissions:
 *   post:
 *     tags: [Empresa]
 *     summary: Asignar permisos a una sala
 *     description: Permite a un empleado autenticado asignar permisos a una sala específica.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT del empleado autenticado.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               id_room:
 *                 type: string
 *                 description: ID de la sala a la que se le asignarán los permisos.
 *                 example: "615c1b2f23e4f1a1d2e5c892"
 *               permissions:
 *                 type: string
 *                 description: Permiso que se asignará a la sala.
 *                 example: "edit_room"
 *     responses:
 *       200:
 *         description: Permiso agregado exitosamente a la sala.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "add permit"
 *                 room:
 *                   type: object
 *                   properties:
 *                     id_room:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Token inválido, empleado o sala inexistente, o error de permisos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "nonexistent emp"
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
 */
router.post('/assignRPermissions', tokenMiddleware, assignRPermissions);
/**
 * @swagger
 * /emp/assignUPermissions:
 *   post:
 *     tags: [Empresa]
 *     summary: Asignar permisos a un usuario
 *     description: Permite a un empleado autenticado asignar permisos a un usuario. Verifica que el usuario pertenezca al empleado y que el permiso no esté duplicado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT del empleado autenticado.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               id_user:
 *                 type: string
 *                 description: ID del usuario al que se le asignarán los permisos.
 *                 example: "615c1b2f23e4f1a1d2e5c892"
 *               permissions:
 *                 type: string
 *                 description: Permiso que se asignará al usuario.
 *                 example: "edit_profile"
 *     responses:
 *       200:
 *         description: Permiso agregado exitosamente al usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "add permit"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: El permiso ya existe para este usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Permission already exists"
 *       404:
 *         description: Token inválido, empleado inexistente, usuario inexistente, o permisos no asignados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "nonexistent usero Permissions no create"
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
 */
router.post('/assignUPermissions', tokenMiddleware, assignUPermissions);
router.get('/viewusers', tokenMiddleware, viewusers)
router.get('/pview', tokenMiddleware, pview)
router.put('/pdelete', tokenMiddleware, pdelete)

module.exports = router;