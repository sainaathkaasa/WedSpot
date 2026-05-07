import React from 'react';
import { Box, Typography, type SvgIconProps, alpha, styled, Stack } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import DashboardCard from '../DashboardCard/DashboardCard';

interface DashboardStatsProps {
    label: string;
    value: string | number;
    change?: string;
    icon: React.ElementType<SvgIconProps>;
    color: string;
    trend?: 'up' | 'down';
}

const IconWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$color',
})<{ $color: string }>(({ theme, $color }) => ({
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha($color, 0.08),
    color: $color,
    transition: theme.dashboard.transition,
}));

const DashboardStats: React.FC<DashboardStatsProps> = ({
    label,
    value,
    change,
    icon: Icon,
    color,
    trend = 'up',
}) => {
    // Component body

    return (
        <DashboardCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Stack spacing={0.5}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 600, 
                        }}
                    >
                        {label}
                    </Typography>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 800, 
                            color: trend === 'up' ? 'success.main' : 'text.primary',
                        }}
                    >
                        {value}
                    </Typography>
                    
                    {change && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                            <TrendingUp sx={{ 
                                fontSize: 16, 
                                color: trend === 'up' ? 'success.main' : 'error.main',
                                transform: trend === 'up' ? 'none' : 'rotate(180deg)'
                            }} />
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: 700, 
                                    color: trend === 'up' ? 'success.main' : 'error.main' 
                                }}
                            >
                                {change}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ color: 'text.secondary', fontWeight: 500 }}
                            >
                                vs last month
                            </Typography>
                        </Box>
                    )}
                </Stack>

                <IconWrapper $color={color}>
                    <Icon sx={{ fontSize: 24 }} />
                </IconWrapper>
            </Box>
        </DashboardCard>
    );
};

export default DashboardStats;
