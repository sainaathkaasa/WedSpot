import { useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
    alpha,
    useTheme,
    LinearProgress,
    CircularProgress,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    Store as StoreIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { DashboardCard } from '@/features/dashboard';
import Chart from 'react-apexcharts';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_API } from '@/features/dashboard/api/dashboard.api';

const AnalyticsPage = () => {
    const theme = useTheme();

    const { data: dashboardResponse, isLoading } = useQuery({
        queryKey: ['dashboard-admin'],
        queryFn: DASHBOARD_API.getAdminMetrics,
    });

    const metrics = dashboardResponse?.data?.metrics || {};
    const chartData = dashboardResponse?.data?.chartData || [];

    const chartOptions: any = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
            sparkline: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3, colors: [theme.palette.primary.main] },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100],
                colorStops: [
                    { offset: 0, color: theme.palette.primary.main, opacity: 0.4 },
                    { offset: 100, color: theme.palette.primary.main, opacity: 0.05 }
                ]
            }
        },
        grid: {
            borderColor: alpha(theme.palette.divider, 0.1),
            strokeDashArray: 4,
            padding: { top: 10, right: 20, bottom: 0, left: 10 }
        },
        xaxis: {
            categories: chartData.map((d: any) => d.name) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontWeight: 600,
                    fontSize: '10px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontWeight: 600,
                    fontSize: '10px'
                }
            }
        },
        tooltip: {
            theme: theme.palette.mode,
            x: { show: true },
            marker: { show: true }
        },
        markers: {
            size: 5,
            colors: [theme.palette.primary.main],
            strokeColors: theme.palette.background.paper,
            strokeWidth: 2,
            hover: { size: 7 }
        }
    };

    const chartSeries = [{
        name: 'Platform Bookings',
        data: chartData.map((d: any) => d.bookings) || [0, 0, 0, 0, 0, 0]
    }];

    const stats = useMemo(() => [
        { label: 'Platform Revenue', value: `₹${((metrics.totalRevenue || 0) / 1000).toFixed(1)}K`, change: '+12.5%', trend: 'up', icon: <MoneyIcon />, color: '#22c55e' },
        { label: 'Active Vendors', value: (metrics.totalVendors || 0).toString(), change: '+5.2%', trend: 'up', icon: <StoreIcon />, color: '#7c3aed' },
        { label: 'Total Clients', value: (metrics.totalClients || 0).toString(), change: '+18.1%', trend: 'up', icon: <PeopleIcon />, color: '#0ea5e9' },
        { label: 'Total Bookings', value: (metrics.totalBookings || 0).toString(), change: '+24.5%', trend: 'up', icon: <TrendingUpIcon />, color: '#f59e0b' },
    ], [metrics]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={40} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Platform Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                    Real-time performance metrics and growth insights across the WedsPot ecosystem.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '10px', display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, mb: 1, fontSize: '1.5rem', color: 'text.primary' }}>
                                        {stat.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {stat.trend === 'up' ? (
                                            <ArrowUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                        ) : (
                                            <ArrowDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                        )}
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: '11px',
                                                color: stat.trend === 'up' ? 'success.main' : 'error.main'
                                            }}
                                        >
                                            {stat.change}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    bgcolor: alpha(stat.color, 0.1),
                                    color: stat.color,
                                    display: 'flex'
                                }}>
                                    {stat.icon}
                                </Box>
                            </Box>
                        </DashboardCard>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <DashboardCard title="Booking Trends" subtitle="Monthly platform activity and engagement">
                        <Box sx={{ height: 350, width: '100%', mt: 2 }}>
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="area"
                                height="100%"
                            />
                        </Box>
                    </DashboardCard>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <DashboardCard title="Revenue Distribution" subtitle="Earnings by service category">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                            {[
                                { name: 'Venues', value: 45, color: '#7c3aed' },
                                { name: 'Catering', value: 30, color: '#6366f1' },
                                { name: 'Photography', value: 15, color: '#0ea5e9' },
                                { name: 'Decoration', value: 10, color: '#22c55e' }
                            ].map((category, i) => (
                                <Box key={i}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '11px', color: 'text.primary' }}>{category.name}</Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: '11px', color: 'text.secondary' }}>{category.value}%</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={category.value}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: alpha(category.color, 0.1),
                                            '& .MuiLinearProgress-bar': { bgcolor: category.color, borderRadius: 3 }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </DashboardCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsPage;
