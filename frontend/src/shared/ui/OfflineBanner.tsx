import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { WifiOff as WifiOffIcon } from '@mui/icons-material';

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                bgcolor: 'error.dark',
                color: 'error.contrastText',
                py: 1,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
            }}
        >
            <WifiOffIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600}>
                You are offline. Some features may not work until connection is restored.
            </Typography>
        </Box>
    );
}
