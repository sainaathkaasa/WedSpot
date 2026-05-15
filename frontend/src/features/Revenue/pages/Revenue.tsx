import { useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
    alpha,
    useTheme,
    LinearProgress,
    CircularProgress,
    Stack,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    ArrowUpward as ArrowUpIcon,
    AccountBalance as BankIcon,
    Savings as SavingsIcon
} from '@mui/icons-material';
import { DashboardCard } from '@/features/dashboard';
import Chart from 'react-apexcharts';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_API } from '@/features/dashboard/api/dashboard.api';

const Revenue = () => {
    const theme = useTheme();

    const { data: dashboardResponse, isLoading } = useQuery({
        queryKey: ['dashboard-admin'],
        queryFn: DASHBOARD_API.getAdminMetrics,
    });

    const metrics = dashboardResponse?.data?.metrics || {};
    const chartData = dashboardResponse?.data?.chartData || [];

    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '50%',
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: chartData.map((d: any) => d.name),
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
                },
                formatter: (val: number) => `₹${(val / 1000).toFixed(0)}K`
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                opacityFrom: 0.8,
                opacityTo: 0.3,
            }
        },
        grid: {
            borderColor: alpha(theme.palette.divider, 0.1),
            strokeDashArray: 4,
        },
        colors: [theme.palette.primary.main]
    };

    const chartSeries = [{
        name: 'Revenue',
        data: chartData.map((d: any) => d.revenue || 0)
    }];

    const financeStats = useMemo(() => [
        { label: 'Platform Revenue', value: `₹${(metrics.totalRevenue || 0).toLocaleString()}`, change: '+22%', icon: <MoneyIcon />, color: '#22c55e' },
        { label: 'Pending Bookings', value: (metrics.pendingBookings || 0).toString(), change: 'Action Required', icon: <TrendingUpIcon />, color: '#7c3aed' },
        { label: 'Completed Bookings', value: (metrics.completedBookings || 0).toString(), change: '+18.5%', icon: <BankIcon />, color: '#f59e0b' },
        { label: 'Total Volume', value: (metrics.totalBookings || 0).toString(), change: '+14%', icon: <SavingsIcon />, color: '#0ea5e9' },
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
                    Revenue Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                    Detailed financial insights and revenue tracking.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {financeStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    bgcolor: alpha(stat.color, 0.1),
                                    color: stat.color,
                                    display: 'flex'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: 'text.primary', my: 0.2 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px' }}>
                                        <ArrowUpIcon sx={{ fontSize: 12 }} /> {stat.change}
                                    </Typography>
                                </Box>
                            </Box>
                        </DashboardCard>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <DashboardCard 
                        title="Revenue Trend" 
                        subtitle="Growth over the last 6 months"
                        sx={{ height: '100%' }}
                    >
                        <Box sx={{ height: 350, width: '100%', mt: 1 }}>
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height="100%"
                            />
                        </Box>
                    </DashboardCard>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <DashboardCard 
                        title="Revenue Sources" 
                        subtitle="Distribution by channel"
                        sx={{ height: '100%' }}
                    >
                        <Stack spacing={4} sx={{ mt: 2 }}>
                            {[
                                { name: 'Booking Commission', value: 65, color: '#22c55e' },
                                { name: 'Subscription Fees', value: 25, color: '#7c3aed' },
                                { name: 'Featured Listings', value: 10, color: '#0ea5e9' },
                            ].map((src, i) => (
                                <Box key={i}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{src.name}</Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: '12px', color: 'text.secondary' }}>{src.value}%</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={src.value}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: alpha(src.color, 0.1),
                                            '& .MuiLinearProgress-bar': { bgcolor: src.color }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </DashboardCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Revenue;
