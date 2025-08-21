// src/utils/toastConfig.js
import { toast } from 'react-toastify';

export const showToast = (type, message) => {
  const config = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch(type) {
    case 'success':
      toast.success(message, config);
      break;
    case 'error':
      toast.error(message, config);
      break;
    case 'warning':
      toast.warning(message, config);
      break;
    case 'info':
      toast.info(message, config);
      break;
    default:
      toast(message, config);
  }
};