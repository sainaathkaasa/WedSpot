import React from 'react';
import {
  Favorite as HeartIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as MapPinIcon,
  People as UsersIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  CameraAlt as CameraIcon,
  Cake as CakeIcon,
  CardGiftcard as GiftIcon,
} from '@mui/icons-material';
import { Box, Grid, Typography, Button, Avatar, LinearProgress, useTheme, alpha, CircularProgress } from '@mui/material';
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API } from "@/features/dashboard/api/dashboard.api";
import { useUser } from "@/features/user/context/useUser";

const ClientDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useUser();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-client", user?.id],
    queryFn: () => DASHBOARD_API.getClientMetrics(user?.id || 0),
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
  const activities = dashboardData?.data?.activities || [];

  const budgetStats = [
    { label: 'Wedding Budget', value: '₹15L', icon: GiftIcon, color: theme.palette.secondary.main, progress: 55 },
    { label: 'Total Spent', value: `₹${((metrics.totalSpending || 0) / 100000).toFixed(1)}L`, icon: CheckCircleIcon, color: theme.palette.success.main, progress: 60 },
    { label: 'Confirmed', value: `${metrics.totalBookings || 0}`, icon: UsersIcon, color: theme.palette.warning.main, progress: 75 },
    { label: 'Days Remaining', value: (metrics.upcomingEvents || '0').toString(), icon: ClockIcon, color: theme.palette.error.main, progress: 100 },
  ];

  const bookedVendors = activities.slice(0, 2).map((a: any) => ({
    name: a.title || 'Vendor',
    category: a.description || 'Service',
    status: a.status === 'success' ? 'confirmed' : 'pending',
    amount: '₹1.2L',
    icon: a.status === 'success' ? MapPinIcon : CameraIcon,
    date: a.time || 'Jan 15, 2025'
  }));

  const actionCards = [
    { title: 'Marketplace', desc: 'Discover and book curated premium vendors.', icon: UsersIcon, color: theme.palette.secondary.main, count: 'New' },
    { title: 'Budgeter', desc: 'Real-time expense and payment tracking.', icon: GiftIcon, color: theme.palette.success.main, count: null },
    { title: 'Timeline', desc: 'Chronological roadmap of your big day.', icon: CalendarIcon, color: theme.palette.warning.main, count: null },
  ];

  const chartCategories = chartData.map((d: any) => d.name);
  const chartAllocated = chartData.map((d: any) => d.progress || 0);

  return (
    <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
      <DashboardCard sx={{ mb: 4, position: 'relative', background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.05)})`, borderColor: alpha(theme.palette.secondary.main, 0.2) }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <HeartIcon sx={{ color: theme.palette.secondary.main }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wedding Journey</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
              {user?.name?.split(' ')[0] || 'Client'} & Partner
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <CalendarIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>January 15, 2025</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <MapPinIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Royal Banquet Hall, Mumbai</Typography>
              </Box>
            </Box>

            <Box sx={{ maxWidth: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Planning Progress</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>{Math.round((metrics.totalBookings || 0) / 12 * 100)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={Math.round((metrics.totalBookings || 0) / 12 * 100)} sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.secondary.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: theme.palette.secondary.main, borderRadius: 4 } }} />
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', p: 3, borderRadius: '24px', background: 'white', boxShadow: theme.shadows[10], border: `1px solid ${theme.dashboard.glassBorder}`, minWidth: 160 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: theme.palette.secondary.main, lineHeight: 1 }}>{metrics.upcomingEvents || 0}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Upcoming Events</Typography>
          </Box>
        </Box>
      </DashboardCard>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {budgetStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardStats {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <DashboardCard sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.dashboard.glassBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>Budget Overview</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textTransform: 'uppercase', fontSize: '0.65rem' }}>Allocated: ₹15L</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.success.main, textTransform: 'uppercase', fontSize: '0.65rem' }}>Spent: ₹{((metrics.totalSpending || 0) / 100000).toFixed(1)}L</Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={{
                  chart: { type: 'bar', toolbar: { show: false }, fontFamily: theme.typography.fontFamily },
                  plotOptions: { bar: { borderRadius: 10, columnWidth: '40%', distributed: false } },
                  colors: [theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main],
                  dataLabels: { enabled: false },
                  grid: { borderColor: alpha(theme.palette.divider, 0.5), strokeDashArray: 5 },
                  xaxis: { categories: chartCategories.length > 0 ? chartCategories : ['Catering', 'Venue', 'Decor', 'Photography', 'Invitations'], axisBorder: { show: false }, axisTicks: { show: false } },
                  legend: { show: true, fontWeight: 600 },
                  tooltip: { theme: 'light' }
                }}
                series={[{ name: "Allocated", data: [300000, 500000, 200000, 300000, 100000] }, { name: "Spent", data: [250000, 350000, 80000, 120000, 20000] }]}
                type="bar"
                height={350}
              />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

    </Box>
  );
};

export default ClientDashboard;
