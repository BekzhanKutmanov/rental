import { SnackbarProvider } from 'notistack';
import React from 'react';

export const withToast = (component: () => React.ReactNode) => () => (
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={3000}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    {component()}
  </SnackbarProvider>
);
