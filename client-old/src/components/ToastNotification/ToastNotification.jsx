/* eslint-disable react-refresh/only-export-components */
import toast, { Toaster } from 'react-hot-toast';

export const showToast = (message, type) => {
  toast(message, {
    icon: type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️nfo',
    style: {
      border: type === 'error' ? '1px solid #F44336' : '1px solid #4CAF50',
      padding: '16px',
      color: type === 'error' ? '#F44336' : '#4CAF50',
    },
  });
};
const ToastNotification = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{ style: { padding: '16px', fontSize: '16px' }, duration: 3000 }}
    />
  );
};

export default ToastNotification;
