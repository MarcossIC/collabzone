const express = require('express');
const router = express.Router();
const { getUserNotifications, getNotificationById, 
        deleteNotification, updateNotification, 
        acceptInvitation, getUnreadNotifications
 } = require('../controller/notifications.controller.js');
const { tokenMiddleware } = require('../middlewares/middleware.js');


/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: API para la gestión de notificaciones
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Obtener todas las notificaciones del usuario autenticado
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: No autorizado
 */
router.get('/', tokenMiddleware, getUserNotifications);

/**
 * @swagger
 * /notifications/unread:
 *   get:
 *     summary: Obtener notificaciones no leídas del usuario actual.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones no leídas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64bfe78c1234abcd5678ef90"
 *                   user:
 *                     type: string
 *                     example: "64bfe78c5678abcd1234ef90"
 *                   type:
 *                     type: string
 *                     example: "message"
 *                   Titel:
 *                     type: string
 *                     example: "Notificación importante"
 *                   message:
 *                     type: string
 *                     example: "Tienes una nueva invitación."
 *                   link:
 *                     type: string
 *                     example: "https://example.com/invitacion"
 *                   isRead:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-22T10:00:00.000Z"
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/unread', tokenMiddleware, getUnreadNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Obtener una notificación por ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Datos de la notificación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notificación no encontrada
 */
router.get('/:id', tokenMiddleware, getNotificationById);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Actualizar una notificación (marcar como leída)
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notificación actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notificación no encontrada
 */
router.put('/:id', tokenMiddleware, updateNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Eliminar una notificación por ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       404:
 *         description: Notificación no encontrada
 */
router.delete('/:id', tokenMiddleware, deleteNotification);

/**
 * @swagger
 * /notifications/accept:
 *   put:
 *     summary: Aceptar invitación y asociar un usuario con una empresa mediante un token.
 *     tags: [Notification]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token JWT con los datos de la invitación (usuario y empresa).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario asociado exitosamente a la empresa.
 *       400:
 *         description: Token faltante o el usuario ya está asociado a una empresa.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/accept', tokenMiddleware, acceptInvitation);

module.exports = router;