import type { ReactNode } from 'react';
import { toast, ToastOptions, Bounce } from 'react-toastify';
import { isMobileDevice } from './device.util';

const defaultOptions: Omit<ToastOptions, 'position'> = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
  transition: Bounce,
  className: `
    whitespace-nowrap
    pr-10!
    min-w-80!
    max-w-300!
    w-fit!
    text-white!
  `
};

const getDefaultOptions = (): ToastOptions => ({
  ...defaultOptions,
  position: isMobileDevice() ? 'top-center' : 'bottom-right'
});

const showSuccess = (message: string | ReactNode, options?: ToastOptions) => {
  toast.success(message, { ...getDefaultOptions(), ...options });
};

const showError = (message: string | ReactNode, options?: ToastOptions) => {
  toast.error(message, { ...getDefaultOptions(), ...options });
};

const showInfo = (message: string | ReactNode, options?: ToastOptions) => {
  toast.info(message, { ...getDefaultOptions(), ...options });
};

const showWarning = (message: string | ReactNode, options?: ToastOptions) => {
  toast.warn(message, { ...getDefaultOptions(), ...options });
};

export const notify = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning
};
