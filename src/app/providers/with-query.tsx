// src/app/providers/with-query.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import React from 'react';

// Инициализируем клиент с базовыми настройками
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем перезапрос при смене вкладки браузера (по желанию)
      retry: 1,                    // Количество попыток при ошибке
      staleTime: 5 * 60 * 1000,    // Данные считаются свежими 5 минут
    },
  },
});

export const withQuery = (component: () => React.ReactNode) => () => (
  <QueryClientProvider client={queryClient}>
    {component()}
    {/* Инструменты разработчика (DevTools) — откроются только в dev-режиме */}
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
);
