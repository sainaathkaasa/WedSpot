import React from 'react';
import { Box, Typography, LinearProgress, type SvgIconProps, alpha, styled } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import DashboardCard from '../DashboardCard/DashboardCard';

interface DashboardStatsProps {
    label: string;
    value: string | number;
    change?: string;
    icon: React.ElementType<SvgIconProps>;
    color: string;
    progress?: number;
    trend?: 'up' | 'down';
}

const IconWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$color',
})<{ $color: string }>(({ theme, $color }) => ({
    width: 48,
    height: 48,
    borderRadius: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha($color, 0.1),
    color: $color,
}));

const TrendBadge = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$trend',
})<{ $trend: 'up' | 'down' }>(({ theme, $trend }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
    borderRadius: theme.spacing(0.75),
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: $trend === 'up'
        ? alpha(theme.palette.success.main, 0.1)
        : alpha(theme.palette.error.main, 0.1),
    color: $trend === 'up'
        ? theme.palette.success.main
        : theme.palette.error.main,
}));

const StyledLinearProgress = styled(LinearProgress, {
    shouldForwardProp: (prop) => prop !== '$color',
})<{ $color: string }>(({ $color }) => ({
    height: 6,
    borderRadius: 3,
    backgroundColor: alpha($color, 0.1),
    '& .MuiLinearProgress-bar': {
        backgroundColor: $color,
        borderRadius: 3,
    },
}));

const DashboardStats: React.FC<DashboardStatsProps> = ({
    label,
    value,
    change,
    icon: Icon,
    color,
    progress,
    trend = 'up',
}) => {
    return (
        <DashboardCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <IconWrapper $color={color}>
                    <Icon />
                </IconWrapper>
                {change && (
                    <Box sx={{ textAlign: 'right' }}>
                        <TrendBadge $trend={trend}>
                            <TrendingUp sx={{ fontSize: 14 }} />
                            {change}
                        </TrendBadge>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                            vs last month
                        </Typography>
                    </Box>
                )}
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
                {label}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: progress !== undefined ? 2 : 0 }}>
                {value}
            </Typography>

            {progress !== undefined && (
                <Box sx={{ mt: 'auto' }}>
                    <StyledLinearProgress
                        variant="determinate"
                        value={progress}
                        $color={color}
                    />
                </Box>
            )}
        </DashboardCard>
    );
};

export default DashboardStats;
