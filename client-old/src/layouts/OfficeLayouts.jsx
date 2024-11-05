import AppHeader from '@/components/AppHeader/AppHeader';
import { RoomModal } from '@/components/RoomModal/RoomModal';
import { UsersModal } from '@/components/UsersModal/UsersModal';
import ZoomControls from '@/components/ZoomControls/ZoomControls';

const OfficeLayouts = ({ children, hasTools }) => {
  return (
    <>
      <header className="mx-7 my-6 px-10">
        <AppHeader />
      </header>
      <div className="mt-5 flex flex-col items-center justify-center">
        <div className="flex w-full justify-between px-[3.5dvw]">
          <aside className="mt-10 h-16 w-80 min-w-[300px] rounded-4xl border border-accent-1000 text-center shadow-drop">
            WIDGET
          </aside>
          {children}
          {hasTools ? (
            <aside className="my-auto">
              <ZoomControls />
            </aside>
          ) : null}
        </div>
      </div>
      <RoomModal />
      <UsersModal />
    </>
  );
};

export default OfficeLayouts;
