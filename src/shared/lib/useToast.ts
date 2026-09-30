import { closeSnackbar, enqueueSnackbar, type VariantType } from 'notistack';

type ToastMessage = string;

const show = (message: ToastMessage, variant: VariantType = 'default') =>
  enqueueSnackbar(message, { variant });

export const toast = {
  show,
  success: (message: ToastMessage) => show(message, 'success'),
  error: (message: ToastMessage) => show(message, 'error'),
  warning: (message: ToastMessage) => show(message, 'warning'),
  info: (message: ToastMessage) => show(message, 'info'),
  close: closeSnackbar,
};

export const useToast = () => toast;
