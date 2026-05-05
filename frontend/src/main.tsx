import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { UserProvider } from '@/features/user/context/UserProvider';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import theme from '@/contexts/ThemeContext';
import '@/styles/globals.scss';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { Provider } from 'react-redux';
import { store } from '@/store';

import { CartProvider } from '@/contexts/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <OfflineBanner />
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserProvider>
              <AuthProvider>
                <SnackbarProvider>
                  <CartProvider>
                    <RouterProvider router={router} />
                  </CartProvider>
                </SnackbarProvider>
              </AuthProvider>
            </UserProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
