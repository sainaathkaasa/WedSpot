import React from 'react';
import { Paper, type PaperProps, styled, Box, alpha, Typography, Stack, Divider } from '@mui/material';

/**
 * Valid variants for the DashboardCard
 */
export type DashboardCardVariant = 'glass' | 'dark' | 'outlined';

interface DashboardCardProps extends Omit<PaperProps, 'variant' | 'title'> {
    children: React.ReactNode;
    /**
     * Optional card title
     */
    title?: React.ReactNode;
    /**
     * Optional card subtitle
     */
    subtitle?: React.ReactNode;
    /**
     * Optional icon to display next to the title
     */
    icon?: React.ReactNode;
    /**
     * Optional actions to display in the header (e.g. Buttons, Icons)
     */
    actions?: React.ReactNode;
    /**
     * If true, removes padding from the card body
     */
    noPadding?: boolean;
    /**
     * Visual style variant of the card
     */
    variant?: DashboardCardVariant;
}

/**
 * Internal styled component for the DashboardCard
 */
const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== '$variant',
})<{ $variant?: DashboardCardVariant }>(({ theme, $variant }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    transition: theme.dashboard.transition,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',

    // Variants
    ...($variant === 'dark' && {
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.common.white,
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    }),

    ...($variant === 'outlined' && {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.divider}`,
    }),

    '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.2),
        backgroundColor: $variant === 'dark' ? theme.palette.text.primary : alpha(theme.palette.primary.main, 0.005),
    }
}));

const DashboardCard: React.FC<DashboardCardProps> = ({
    children,
    title,
    subtitle,
    icon,
    actions,
    noPadding = false,
    variant = 'glass',
    sx,
    ...props
}) => {
    const hasHeader = title || subtitle || icon || actions;

    return (
        <StyledPaper
            elevation={0}
            $variant={variant}
            sx={sx}
            {...props}
        >
            {hasHeader && (
                <>
                    <Box sx={{ 
                        p: 2.5, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        minHeight: 64
                    }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {icon && (
                                <Box sx={{ 
                                    color: 'primary.main', 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    '& svg': { fontSize: 20 }
                                }}>
                                    {icon}
                                </Box>
                            )}
                            <Box>
                                {title && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                                        {title}
                                    </Typography>
                                )}
                                {subtitle && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                        {actions && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {actions}
                            </Box>
                        )}
                    </Box>
                    <Divider sx={{ opacity: 0.6 }} />
                </>
            )}
            <Box sx={{ 
                p: noPadding ? 0 : 2.5, 
                flexGrow: 1,
                position: 'relative', 
                zIndex: 1 
            }}>
                {children}
            </Box>
        </StyledPaper>
    );
};

export default DashboardCard;
