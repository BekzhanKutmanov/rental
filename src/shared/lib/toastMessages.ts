export const toastMessages = {
  created: 'Успешно создано',
  updated: 'Успешно изменено',
  deleted: 'Успешно удалено',
  saved: 'Успешно сохранено',
  error: 'Ошибка!',
  tryAgainLater: 'Повторите попытку позже',
  serverError: 'Проблема с сервером',
  serverUnavailable: 'Сервер временно недоступен',
  badRequest: 'Некорректный запрос',
  unauthorized: 'Необходимо авторизоваться',
  forbidden: 'Недостаточно прав',
  notFound: 'Данные не найдены',
  conflict: 'Конфликт данных',
  validationError: 'Проверьте введенные данные',
  requiredFields: 'Заполните обязательные поля',
  loadingError: 'Не удалось загрузить данные',
  unknownError: 'Что-то пошло не так',
} as const;

export type ToastMessageKey = keyof typeof toastMessages;
