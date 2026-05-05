import {
  CalendarMonth as CalendarIcon,
  AttachMoney as DollarIcon,
  Grade as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Box, Grid, Typography, useTheme, alpha, useMediaQuery, CircularProgress } from '@mui/material';
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API } from "@/features/dashboard/api/dashboard.api";
import { useUser } from "@/features/user/context/useUser";

const VendorDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useUser();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-vendor", user?.id],
    queryFn: () => DASHBOARD_API.getVendorMetrics(user?.id || 0),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const metrics = dashboardData?.data?.metrics || {};
  const chartData = dashboardData?.data?.chartData || [];

  const stats = [
    { label: 'Bookings Reach', value: (metrics.totalBookings || '0').toString(), change: '+8%', icon: CalendarIcon, color: theme.palette.secondary.main, progress: 72 },
    { label: 'Annual Revenue', value: `₹${((metrics.totalEarnings || 0) / 100000).toFixed(1)}L`, change: '+15%', icon: DollarIcon, color: theme.palette.success.main, progress: 65 },
    { label: 'Client Rating', value: Number(metrics.avgRating || '0').toFixed(1), change: '+0.2', icon: StarIcon, color: theme.palette.warning.main, progress: 96 },
    { label: 'Reach Status', value: (metrics.totalServices || '0').toString(), change: '+23%', icon: TrendingUpIcon, color: theme.palette.info.main, progress: 88 },
  ];

  const chartCategories = chartData.map((d: any) => d.name);
  const chartValues = chartData.map((d: any) => d.bookings || 0);

  return (
    <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardStats {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <DashboardCard noPadding>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.dashboard.glassBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>Monthly Success</Typography>
              <Typography variant="overline" sx={{ fontWeight: 700, color: theme.palette.secondary.main, fontSize: '0.75rem' }}>Real-time Performance</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={{
                  chart: { type: 'area', toolbar: { show: false }, fontFamily: theme.typography.fontFamily },
                  colors: [theme.palette.secondary.main],
                  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1, stops: [0, 90, 100] } },
                  stroke: { curve: 'smooth', width: 3 },
                  grid: { borderColor: alpha(theme.palette.divider, 0.5), strokeDashArray: 5 },
                  xaxis: { categories: chartCategories.length > 0 ? chartCategories : ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], axisBorder: { show: false }, axisTicks: { show: false } },
                  tooltip: { theme: 'light' }
                }}
                series={[{ name: "Bookings", data: chartValues.length > 0 ? chartValues : [12, 18, 15, 25, 32, 45] }]}
                type="area"
                height={isMobile ? 250 : 300}
              />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDashboard;
