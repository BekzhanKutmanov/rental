import { toastMessages } from './toastMessages';

const statusMessages: Record<number, string> = {
  400: toastMessages.badRequest,
  401: toastMessages.unauthorized,
  403: toastMessages.forbidden,
  404: toastMessages.notFound,
  409: toastMessages.conflict,
  422: toastMessages.validationError,
  500: toastMessages.serverError,
  502: toastMessages.serverError,
  503: toastMessages.serverUnavailable,
};

export const getToastMessageByStatus = (status?: number) => {
  if (!status) {
    return toastMessages.unknownError;
  }

  return statusMessages[status] ?? toastMessages.tryAgainLater;
};

export const useToastMessageByStatus = () => getToastMessageByStatus;
