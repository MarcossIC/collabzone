const mongoose = require('mongoose');
const Notification = require('../persistencia/models/notifications.models');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const User = require("../persistencia/models/user.models.js");
dotenv.config();

// Obtener todas las notificaciones del usuario autenticado
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ user: userId });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error al obtener las notificaciones' });
    }
};

// Notificaciones no leidas
exports.getUnreadNotifications = async (req, res) => {
  try {
      const userId = req.user._id;

      // Obtener solo notificaciones no leídas, ordenadas por fecha de creación (más reciente primero)
      const unreadNotifications = await Notification.find({ 
          user: userId, 
          isRead: false 
      }).sort({ createdAt: -1 }); // Orden descendente

      res.status(200).json(unreadNotifications);
  } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      res.status(500).json({ 
          message: 'Error al obtener las notificaciones no leídas' 
      });
  }
};

// Obtener notificación por ID
exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error al obtener notificación:', error);
        res.status(500).json({ message: 'Error al obtener la notificación' });
    }
};

// Actualizar una notificación (por ejemplo, marcar como leída)
exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error al actualizar notificación:', error);
        res.status(500).json({ message: 'Error al actualizar la notificación' });
    }
};

// Eliminar notificación por ID
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.status(200).json({ message: 'Notificación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({ message: 'Error al eliminar la notificación' });
    }
};

// controlador para aceptar la invitacion
exports.acceptInvitation = async (req, res) => {
  try {
    const userId = req.user._id; // ID del usuario que está aceptando la invitación
    const tokenInvit = req.body.token; // Extraer el token del cuerpo de la solicitud

    // Verificar que el token esté presente y sea válido
    if (!tokenInvit || typeof tokenInvit !== 'string') {
      return res.status(400).json({ message: 'Falta el Token de Invitación o no es válido.' });
    }

    // Decodificar el token
    let decoded;
    try {
      decoded = jwt.verify(tokenInvit, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    // Asegúrate de que el notificationId y empId existen en el token
    const { notificationId, empId } = decoded;
    if (!notificationId || !empId) {
      return res.status(400).json({ message: 'Faltan datos en el token.' });
    }

    // Verificar que el notificationId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: 'ID de notificación inválido.' });
    }

    // Buscar la notificación
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada.' });
    }

    // Marcar la notificación como leída
    notification.read = true;
    await notification.save();

    // Buscar al usuario por ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar si el usuario ya está asociado a una empresa
    if (user.id_emp) {
      return res.status(400).json({ message: 'El usuario ya está asociado a una empresa.' });
    }

    // Asociar al usuario con la empresa
    user.id_emp = empId;
    await user.save();

    res.status(200).json({ message: 'Usuario asociado exitosamente a la empresa.' });

  } catch (error) {
    console.error('Error al aceptar la invitación:', error);
    res.status(500).json({
      message: 'Error al aceptar la invitación.',
      error: error.message || error
    });
  }
};