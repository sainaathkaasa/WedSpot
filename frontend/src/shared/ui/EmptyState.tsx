import { Box, Typography, Button, useTheme } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    title = 'No data available',
    description = 'There are no records to display.',
    icon,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                py: theme.spacing(6),
                px: theme.spacing(4),
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: theme.dashboard.cardRadius,
                border: '1px dashed',
                borderColor: 'divider',
            }}
        >
            {icon || <InboxIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />}
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600} gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: theme.spacing(2.25) }}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}
