import { useAtom } from 'jotai';
import NotificationModal from './NotificationModal';
import { modalAtom } from '@/store/modalAtom';
import { useEffect, useState } from 'react';
import {
  getAllNotifications,
  getUnreadNotifications,
} from '@/utils/functions/notificationService';

const Notifications = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUnreadNotifications = async () => {
    try {
      const unreadData = await getUnreadNotifications();
      setNotifications(prev =>
        prev.map(notif =>
          unreadData.some(unread => unread.id === notif.id)
            ? { ...notif, read: false }
            : notif
        )
      );
    } catch (error) {
      console.log('Error al obtener las notificaciones no leídas:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getAllNotifications();
        setNotifications(data);
      } catch (error) {
        console.log('Error al obtener las notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // const notifications = [
  //   {
  //     _id: 1,
  //     icon: '',
  //     title: 'Tarea asignada',
  //     description: 'Admin te ha asignado una nueva tarea.',
  //     date: '2024-10-20T14:48:00.000Z',
  //     type: 'task',
  //   },
  //   {
  //     id: 2,
  //     icon: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  //     title: 'Invitación',
  //     description: 'Empresa te ha invitado a unirte a su equipo.',
  //     date: '2024-10-19T08:30:00.000Z',
  //     type: 'invitation',
  //     token: '1234567890',
  //   },
  //   {
  //     id: 3,
  //     icon: '',
  //     title: 'Bienvenido',
  //     description: 'Bienvenido a Escape CO',
  //     date: '2024-10-18T09:15:00.000Z',
  //     type: 'welcome',
  //   },
  // ];

  return (
    <NotificationModal
      notifications={notifications}
      closeModal={() => setModal(prev => ({ ...prev, open: false }))}
      refreshNotifications={fetchUnreadNotifications}
      loading={loading}
    />
  );
};

export default Notifications;
