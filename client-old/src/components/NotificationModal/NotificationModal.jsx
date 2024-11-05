import {
  putAcceptInvitation,
  putReadNotification,
} from '@/utils/functions/notificationService';
import { ModalTitleWrapper } from '../ModalWrapper/ModalTitleWrapper';
import NotificationItem from './NotificationItem';

const MODAL_ID = 'notification';
const NotificationModal = ({
  notifications,
  closeModal,
  refreshNotifications,
  loading,
}) => {
  const handleAcceptNotification = async token => {
    const data = await putAcceptInvitation(token);
    console.log(`Invitación aceptada: ${token}`);
    refreshNotifications();
    return data;
  };

  const handleReadNotification = async id => {
    const data = await putReadNotification(id);
    console.log(`Notificación marcada como leida: ${id}`);
    refreshNotifications();
    return data;
  };

  return (
    <div>
      <ModalTitleWrapper
        id={MODAL_ID}
        className="max-h-[461px] w-full max-w-[322px]"
        title="Notificaciones">
        <div className="absolute -top-12 right-5 size-6">
          <button onClick={closeModal}>
            <img src="/images/close.png" alt="Close" />
          </button>
        </div>
        <div className="flex size-full flex-col items-center gap-y-4 rounded-b-4xl bg-accent-100 py-4">
          {loading ? (
            <p>Cargando...</p>
          ) : notifications.length === 0 ? (
            <p>No tienes notificaciones por el momento</p>
          ) : (
            <div>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification._id}
                  id={notification._id}
                  title={notification.Titel}
                  description={notification.message}
                  date={notification.createdAt}
                  icon={notification.icon}
                  type={notification.type}
                  token={notification.link}
                  onAccept={handleAcceptNotification}
                  onHover={handleReadNotification}
                />
              ))}
            </div>
          )}
        </div>
      </ModalTitleWrapper>
    </div>
  );
};

export default NotificationModal;
