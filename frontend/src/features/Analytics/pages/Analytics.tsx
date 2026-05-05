import {
    Box,
    Typography,
    Grid,
    alpha,
    useTheme,
    LinearProgress,
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

const AnalyticsPage = () => {
    const theme = useTheme();

    const chartOptions: any = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            },
            sparkline: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: [theme.palette.primary.main]
        },
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
                formatter: (val: number) => `${val}%`
            }
        },
        tooltip: {
            theme: theme.palette.mode,
            x: { show: true },
            y: {
                formatter: (val: number) => `${val}% Growth`
            },
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
        name: 'Revenue Growth',
        data: [60, 45, 75, 50, 90, 85]
    }];

    const stats = [
        { label: 'Total Revenue', value: '₹12,45,000', change: '+12.5%', trend: 'up', icon: <MoneyIcon />, color: '#22c55e' },
        { label: 'Active Vendors', value: '142', change: '+5.2%', trend: 'up', icon: <StoreIcon />, color: '#7c3aed' },
        { label: 'Total Clients', value: '850', change: '+18.1%', trend: 'up', icon: <PeopleIcon />, color: '#0ea5e9' },
        { label: 'Conversion Rate', value: '24.5%', change: '-2.4%', trend: 'down', icon: <TrendingUpIcon />, color: '#f59e0b' },
    ];

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 2, 
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                }}
            >
                Analytics & Insights
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '11px', display: 'block', mb: 0.5 }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, mb: 1, fontSize: '1.5rem', color: stat.color }}>
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
                                        <Typography sx={{ color: 'text.secondary', ml: 0.5, fontSize: '11px', fontWeight: 500 }}>vs last month</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 3,
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
                    <DashboardCard sx={{ height: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: 'text.primary' }}>Revenue Growth (Last 6 Months)</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: '11px', color: 'text.secondary' }}>Growth %</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ height: 300, width: '100%', mt: 2 }}>
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
                    <DashboardCard sx={{ height: 400 }}>
                        <Typography sx={{ fontWeight: 800, mb: 4 }}>Top Categories</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: alpha(category.color, 0.1),
                                            '& .MuiLinearProgress-bar': { bgcolor: category.color, borderRadius: 4 }
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
