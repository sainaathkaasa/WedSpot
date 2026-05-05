import { createContext, useContext } from 'react';
import type { AlertColor } from '@mui/material';

export type SnackbarContextType = {
  show: (message: string, severity?: AlertColor, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
  warning: (message: string, durationMs?: number) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = (): SnackbarContextType => {
  const ctx = useContext(SnackbarContext);

  if (!ctx) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }

  return ctx;
};
