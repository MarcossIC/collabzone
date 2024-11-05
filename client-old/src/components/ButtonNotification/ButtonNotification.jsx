import { modalAtom } from '@/store/modalAtom';
import { useSetAtom } from 'jotai';
import { useRef } from 'react';

const ButtonNotification = () => {
  const setModal = useSetAtom(modalAtom);
  const btnRef = useRef(null);

  const openNotification = () => {
    if (!btnRef.current) return;
    const btnRect = btnRef.current.getBoundingClientRect();
    console.log('Llegue');
    setModal(prev => ({
      ...prev,
      open: true,
      modalId: 'notification',
      coords: [btnRect.bottom * -1 + 95, btnRect.left + 95],
      position: 'top',
      prevModal: '',
      firstOpen: true,
    }));
  };

  return (
    <div>
      <button
        ref={btnRef}
        onClick={openNotification}
        className="flex size-12 items-center justify-center rounded-full border border-black shadow-drop">
        <img src="/images/notification.png" className="w-6" alt="Notificación" />
      </button>
    </div>
  );
};

export default ButtonNotification;
