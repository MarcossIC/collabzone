import AppSearchBar from '../Search/AppSearchBar';
import ButtonNotification from '../ButtonNotification/ButtonNotification';
import Notifications from '../NotificationModal/Notifications';

function AppHeader() {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="h-[60px] w-[65px] rounded-lg border border-neutral-950">
        <button className="size-auto bg-white"></button>
      </div>
      <div className="flex flex-row gap-5">
        <AppSearchBar />
        <ButtonNotification />
        {/* Modal de Notificaciones */}
        <Notifications />
      </div>
    </div>
  );
}

export default AppHeader;
