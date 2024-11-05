import { apiService } from '../api/axios';

export const getAllNotifications = async () => {
  const [error, data] = await apiService.get('/notifications');

  if (error) {
    console.error('Error al obtener todas las notificaciones:', error);
    return [];
  }
  return data && Array.isArray(data) ? data : [];
};

export const getUnreadNotifications = async () => {
  const [error, data] = await apiService.unreadNotifications();
  if (error) {
    console.error('Error al obtener las notificaciones no leidas:', error);
    return [];
  }
  return data;
};

export const putReadNotification = async notificationId => {
  const [error, data] = await apiService.readNotification(notificationId);
  if (error) {
    console.error('Error al marcar la notificacion como leida:', error);
    return [];
  }
  return data;
};

export const putAcceptInvitation = async token => {
  const [error, data] = await apiService.acceptInvitation(token);
  if (error) {
    console.error('Error al aceptar la invitacion:', error);
    return [];
  }
  return data;
};
