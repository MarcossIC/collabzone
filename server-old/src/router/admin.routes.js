const express = require('express');
const router = express.Router();
const { tokenMiddleware } = require ('../middlewares/middleware.js')
const { search_user, associateUserToCompany,  } = require('../controller/admin.controller.js')

/**
 * @swagger
 * /admin/searchUser:
 *  get:
 *    summary: Filtra la lista de usuarios con solo recibir el email o username
 *    description: 
 *    tags:
 *      - Admin
 *    security:
 *      - bearerAuth: []
 */
router.get('/searchUser', tokenMiddleware, search_user);

/**
 * @swagger
 * /admin/associate:
 *   put:
 *     summary: Asocia un usuario a una empresa y crea una notificación
 *     description: Envía una invitación a un usuario para que se una a la empresa. Solo requiere el ID del usuario.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario a asociar
 *                 example: "671368c25949f7bd81ae5fc4"
 *     responses:
 *       200:
 *         description: Usuario asociado y notificación creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario asociado a la empresa y notificación enviada."
 *                 user:
 *                   type: object
 *                   description: Detalles del usuario actualizado
 *       400:
 *         description: Error por solicitud incorrecta (por ejemplo, usuario ya asociado).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario ya está asociado a una empresa."
 *       404:
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
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al asociar usuario a la empresa."
 *                 error:
 *                   type: string
 */
router.put("/associate", tokenMiddleware, associateUserToCompany);

module.exports = router;