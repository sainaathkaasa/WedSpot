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
    AttachMoney as MoneyIcon,
    ArrowUpward as ArrowUpIcon,
    AccountBalance as BankIcon,
    Savings as SavingsIcon
} from '@mui/icons-material';
import { DashboardCard } from '@/features/dashboard';
import Chart from 'react-apexcharts';

const Revenue = () => {
    const theme = useTheme();

    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '60%',
                distributed: false,
                dataLabels: { position: 'top' },
            }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                formatter: (val: number) => `₹${val}L`
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: [theme.palette.secondary.main],
                inverseColors: false,
                opacityFrom: 0.8,
                opacityTo: 0.3,
                stops: [0, 100]
            }
        },
        grid: {
            borderColor: alpha(theme.palette.divider, 0.1),
            strokeDashArray: 4,
            yaxis: { lines: { show: true } }
        },
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (val: number) => `₹${val.toLocaleString()},00,000`
            }
        },
        colors: [theme.palette.primary.main]
    };

    const chartSeries = [{
        name: 'Revenue',
        data: [30, 45, 60, 40, 70, 85, 95, 80, 75, 90, 100, 110]
    }];

    const financeStats = [
        { label: 'Platform Revenue', value: '₹52,14,000', change: '+22%', icon: <MoneyIcon />, color: '#22c55e' },
        { label: 'Booking Fees', value: '₹12,45,000', change: '+18.5%', icon: <TrendingUpIcon />, color: '#7c3aed' },
        { label: 'Pending Payouts', value: '₹8,30,000', change: '12 Vendors', icon: <BankIcon />, color: '#f59e0b' },
        { label: 'Net Profit', value: '₹31,40,000', change: '+14%', icon: <SavingsIcon />, color: '#0ea5e9' },
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
                Revenue Analytics
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1, mb: 2 }}>
                {financeStats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    bgcolor: alpha(stat.color, 0.1),
                                    color: stat.color,
                                    display: 'flex'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', fontSize: '11px' }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: stat.color }}>
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
                    <DashboardCard sx={{ height: 420 }}>
                        <Typography sx={{ fontWeight: 900, mb: 2, color: 'text.primary', fontSize: '14px' }}>Revenue Trend (Annual)</Typography>
                        <Box sx={{ height: 320, width: '100%', mt: 1 }}>
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
                    <DashboardCard sx={{ height: 400 }}>
                        <Typography sx={{ fontWeight: 900, mb: 4, color: 'text.primary', fontSize: '14px' }}>Revenue Sources</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {[
                                { name: 'Subscription Fees', value: 35, color: '#7c3aed' },
                                { name: 'Booking Commission', value: 45, color: '#22c55e' },
                                { name: 'Featured Listings', value: 15, color: '#0ea5e9' },
                                { name: 'Ads/Promotions', value: 5, color: '#f59e0b' }
                            ].map((src, i) => (
                                <Box key={i}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '11px', color: 'text.primary' }}>{src.name}</Typography>
                                        <Typography sx={{ fontWeight: 800, fontSize: '11px', color: 'text.secondary' }}>{src.value}%</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={src.value}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor: alpha(src.color, 0.1),
                                            '& .MuiLinearProgress-bar': { bgcolor: src.color, borderRadius: 5 }
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

export default Revenue;
