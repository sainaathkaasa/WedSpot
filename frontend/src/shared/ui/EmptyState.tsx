import { Box, Typography, Button } from '@mui/material';
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
    return (
        <Box
            sx={{
                py: 8,
                px: 4,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
            }}
        >
            {icon || <InboxIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />}
            <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
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
