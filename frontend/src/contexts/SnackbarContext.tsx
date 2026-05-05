import React, { useMemo, useState, useCallback, type JSX } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { SnackbarContext, type SnackbarContextType } from './snackbarContextValue';

export const SnackbarProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(2000);

  const close = () => setOpen(false);

  const show = useCallback((message: string, sev: AlertColor = 'info', durationMs = 2000) => {
    setMsg(message);
    setSeverity(sev);
    setDuration(durationMs);
    setOpen(true);
  }, []);

  const api = useMemo<SnackbarContextType>(() => ({
    show,
    success: (m, d) => show(m, 'success', d),
    error: (m, d) => show(m, 'error', d),
    info: (m, d) => show(m, 'info', d),
    warning: (m, d) => show(m, 'warning', d),
  }), [show]);

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <Snackbar open={open} autoHideDuration={duration} onClose={close} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ mt: 10 }}>
        <Alert onClose={close} severity={severity} variant="filled" sx={{ width: '100%', color: 'white' }}>
          {msg}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
