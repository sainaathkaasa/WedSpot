import React from 'react';
import { Paper, type PaperProps, styled, Box } from '@mui/material';

/**
 * Valid variants for the DashboardCard
 */
export type DashboardCardVariant = 'glass' | 'dark' | 'outlined';

interface DashboardCardProps extends Omit<PaperProps, 'variant'> {
    children: React.ReactNode;
    /**
     * If true, removes padding from the card
     */
    noPadding?: boolean;
    /**
     * Visual style variant of the card
     */
    variant?: DashboardCardVariant;
}

/**
 * Internal styled component for the DashboardCard
 * Uses $ prefix for transient props to avoid passing them to the DOM
 */
const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== '$noPadding' && prop !== '$variant',
})<{ $noPadding?: boolean; $variant?: DashboardCardVariant }>(({ theme, $noPadding, $variant }) => ({
    padding: $noPadding ? 0 : theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.dashboard?.transition || 'all 0.3s ease',
    border: `1px solid ${theme.dashboard?.glassBorder || 'rgba(0,0,0,0.08)'}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',

    // Glass variant (Default)
    ...($variant === 'glass' && {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
    }),

    // Dark variant
    ...($variant === 'dark' && {
        background: '#0f172a',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    }),

    // Outlined variant
    ...($variant === 'outlined' && {
        background: 'transparent',
        boxShadow: 'none',
    }),

    // Premium border effect
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: '1px',
        background: $variant === 'dark'
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent, rgba(255, 255, 255, 0.05))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent, rgba(255, 255, 255, 0.1))',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
    },
}));

const DashboardCard: React.FC<DashboardCardProps> = ({
    children,
    noPadding = false,
    variant = 'glass',
    ...props
}) => {
    return (
        <StyledPaper
            elevation={0}
            $noPadding={noPadding}
            $variant={variant}
            {...props}
        >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {children}
            </Box>
        </StyledPaper>
    );
};

export default DashboardCard;
