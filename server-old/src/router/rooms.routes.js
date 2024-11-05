const express = require('express');
const router = express.Router();
const { createRoom, getRooms, deleteRoomById, getRoomById, getRoomsByEmpId, viewRooms } = require('../controller/rooms.controller.js');
const { tokenMiddleware } = require('../middlewares/middleware.js');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Operaciones relacionadas con la administración en general.
 */

/**
 * @swagger
 * /rooms/create:
 *   post:
 *     summary: Crear una nueva sala.
 *     description: Crea una nueva sala con el nombre especificado y la información del creador.
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
 *               name:
 *                 type: string
 *                 description: Nombre de la sala que se va a crear.
 *                 example: "Sala de Chat"
 *     responses:
 *       201:
 *         description: Sala creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sala creada con éxito"
 *                 roomId:
 *                   type: string
 *                   description: ID de la sala recién creada.
 *                   example: "60c72b2f9b1d5f1a4c0f8e2e"
 *       400:
 *         description: Error en la solicitud, nombre de la sala no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El nombre de la sala es requerido."
 *       403:
 *         description: Acceso denegado. La empresa no está verificada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acceso denegado. La empresa no está verificada."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creando la room"
 */
router.post('/create', tokenMiddleware, createRoom);

/**
 * @swagger
 * /rooms/allrooms:
 *   get:
 *     summary: Obtener todas las salas.
 *     description: Devuelve una lista de todas las salas disponibles.
 *     tags:
 *       - Public
 *     responses:
 *       200:
 *         description: Lista de salas devuelta exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de la sala.
 *                   name:
 *                     type: string
 *                     description: Nombre de la sala.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/allrooms', getRooms);

/**
 * @swagger
 * /rooms/roomsByEmpId:
 *   get:
 *     summary: Obtener todas las salas por empresa.
 *     description: Devuelve una lista de todas las salas asociadas a la empresa autenticada.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas devuelta exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID de la sala.
 *                   id_emp:
 *                     type: string
 *                     description: ID de la empresa a la que pertenece la sala.
 *                   name:
 *                     type: string
 *                     description: Nombre de la sala.
 *                   users:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         socketId:
 *                           type: string
 *                           description: ID del socket del usuario.
 *                         username:
 *                           type: string
 *                           description: Nombre de usuario.
 *                         status:
 *                           type: string
 *                           enum: [active, absent, disconnected]
 *                           description: Estado del usuario en la sala.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación de la sala.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Última actualización de la sala.
 *       401:
 *         description: No autorizado. El token es requerido o no es válido.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/roomsByEmpId', tokenMiddleware,getRoomsByEmpId);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Obtener una sala por ID.
 *     description: Devuelve los detalles de una sala específica usando su ID.
 *     tags:
 *       - Public
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala a obtener.
 *     responses:
 *       200:
 *         description: Detalles de la sala obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID de la sala.
 *                 id_emp:
 *                   type: string
 *                   description: ID de la empresa a la que pertenece la sala.
 *                 name:
 *                   type: string
 *                   description: Nombre de la sala.
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       socketId:
 *                         type: string
 *                         description: ID del socket del usuario.
 *                       username:
 *                         type: string
 *                         description: Nombre de usuario.
 *                       status:
 *                         type: string
 *                         enum: [active, absent, disconnected]
 *                         description: Estado del usuario en la sala.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación de la sala.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Última actualización de la sala.
 *       401:
 *         description: No autorizado. El token es requerido o no es válido.
 *       404:
 *         description: Sala no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', getRoomById);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Eliminar una sala por ID.
 *     description: Elimina una sala específica utilizando su ID.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala a eliminar.
 *     responses:
 *       200:
 *         description: Sala eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sala eliminada correctamente.
 *       401:
 *         description: No autorizado. El token es requerido o no es válido.
 *       404:
 *         description: Sala no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */

router.delete('/:id', tokenMiddleware, deleteRoomById);
router.delete('/viewRooms', tokenMiddleware, viewRooms);



module.exports = router;