import React from "react";
import {
  People as UsersIcon,
  Business as BuildingIcon,
  AttachMoney as DollarIcon,
  BarChart as ChartIcon,
  CalendarMonth as CalendarIcon,
  Security as ShieldIcon,
  CheckCircle as SuccessIcon,
  HourglassEmpty as PendingIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { Box, Grid, Typography, Button, Avatar, useTheme, alpha, CircularProgress } from "@mui/material";
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API } from "@/features/dashboard/api/dashboard.api";

const AdminDashboard: React.FC = () => {
  const theme = useTheme();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: DASHBOARD_API.getAdminMetrics,
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

  const stats = [
    {
      label: "Total Vendors",
      value: metrics.totalVendors?.toLocaleString() || "0",
      change: "+12%",
      icon: BuildingIcon,
      color: theme.palette.primary.main,
      progress: 75,
      trend: "up" as const
    },
    {
      label: "Total Revenue",
      value: `₹${((metrics.totalRevenue || 0) / 100000).toFixed(1)}L`,
      change: "+18%",
      icon: DollarIcon,
      color: theme.palette.success.main,
      progress: 62,
      trend: "up" as const
    },
    {
      label: "Active Clients",
      value: (metrics.totalUsers || "0").toString(),
      change: "+23%",
      icon: UsersIcon,
      color: theme.palette.warning.main,
      progress: 88,
      trend: "up" as const
    },
    {
      label: "Bookings",
      value: (metrics.totalBookings || "0").toString(),
      change: "+15%",
      icon: CalendarIcon,
      color: theme.palette.info.main,
      progress: 94,
      trend: "up" as const
    },
  ];

  const recentActivities = activities.map((a: any, i: number) => ({
    name: a.title || "Activity",
    action: a.description || "",
    time: a.time || "Recently",
    status: a.status || "info",
    icon: i % 3 === 0 ? PendingIcon : i % 3 === 1 ? SuccessIcon : UploadIcon,
    desc: a.description || "",
  }));

  const actionCards = [
    {
      title: "Verify Assets",
      desc: "Review pending vendor documents and insurance.",
      icon: ShieldIcon,
      color: theme.palette.primary.main,
      count: metrics.pendingBookings || 0
    },
    {
      title: "Revenue Report",
      desc: "Export monthly financial growth analysis.",
      icon: ChartIcon,
      color: theme.palette.success.main,
      count: null
    },
    {
      title: "User Audit",
      desc: "System-wide user activity and security log.",
      icon: UsersIcon,
      color: theme.palette.warning.main,
      count: metrics.totalUsers || 0
    },
  ];

  const chartCategories = chartData.map((d: any) => d.name);
  const chartValues = chartData.map((d: any) => d.revenue || d.bookings || 0);

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
        <Grid item xs={12} md={8}>
          <DashboardCard noPadding sx={{ height: '100%' }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Revenue Analysis</Typography>
              <Typography variant="overline" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>Real-time Data</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={{
                  chart: { type: 'area', toolbar: { show: false }, fontFamily: theme.typography.fontFamily },
                  colors: [theme.palette.primary.main],
                  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100] } },
                  stroke: { curve: 'smooth', width: 3 },
                  grid: { borderColor: alpha(theme.palette.divider, 0.5), strokeDashArray: 5 },
                  xaxis: { categories: chartCategories.length > 0 ? chartCategories : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], axisBorder: { show: false }, axisTicks: { show: false } },
                  yaxis: { labels: { style: { colors: theme.palette.text.secondary, fontWeight: 600, fontSize: '10px' }, formatter: (val: number) => `₹${val}L` } },
                  tooltip: { theme: 'light' }
                }}
                series={[{ name: "Revenue", data: chartValues.length > 0 ? chartValues : [3.1, 4.0, 3.5, 5.0, 4.9, 6.2] }]}
                type="area"
                height={350}
              />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard noPadding sx={{ height: '100%', minHeight: 450 }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Vendor Distribution</Typography>
            </Box>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 80px)' }}>
              <Chart
                options={{
                  chart: { type: 'donut', fontFamily: theme.typography.fontFamily },
                  labels: ['Venues', 'Catering', 'Photography', 'Decor', 'Makeup', 'Planners'],
                  colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main, '#f472b6', theme.palette.secondary.main],
                  legend: { position: 'bottom', fontWeight: 600 },
                  plotOptions: { pie: { donut: { size: '75%', labels: { show: true, total: { show: true, label: 'Analytics', fontWeight: 800 } } } } },
                  stroke: { show: false }
                }}
                series={[44, 55, 13, 33, 22, 18]}
                type="donut"
                width="100%"
              />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <DashboardCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Recent Platform Activity</Typography>
              <Button variant="text" size="small" sx={{ fontWeight: 700 }}>View All Logs</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivities.map((activity: any, index: React.Key | null | undefined) => {
                const IconComponent = activity.icon;
                const statusColor = activity.status === 'success' ? theme.palette.success.main : activity.status === 'pending' ? theme.palette.warning.main : theme.palette.info.main;
                return (
                  <Box key={index} sx={{ display: 'flex', gap: 2, p: 2, borderRadius: '16px', background: alpha(theme.palette.background.paper, 0.4), border: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}`, transition: 'all 0.3s ease', '&:hover': { background: alpha(theme.palette.background.paper, 0.8), transform: 'translateY(-2px)' } }}>
                    <Avatar sx={{ bgcolor: alpha(statusColor, 0.1), color: statusColor, borderRadius: '12px' }}>
                      <IconComponent fontSize="small" />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{activity.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{activity.time}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: statusColor, fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>{activity.action}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{activity.desc}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard sx={{ height: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>Operational Control</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {actionCards.map((card, index) => (
                <Button key={index} fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none', p: 2, borderRadius: '16px', background: alpha(theme.palette.background.paper, 0.4), border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, color: 'text.primary', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', background: alpha(theme.palette.background.paper, 0.8), border: `1px solid ${alpha(card.color, 0.4)}` } }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha(card.color, 0.1), color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    <card.icon fontSize="medium" />
                  </Box>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{card.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{card.desc}</Typography>
                  </Box>
                  {card.count && (
                    <Box sx={{ ml: 'auto', px: 1, py: 0.25, borderRadius: '6px', bgcolor: alpha(card.color, 0.1), color: card.color, fontWeight: 900, fontSize: '0.7rem' }}>
                      {card.count}
                    </Box>
                  )}
                </Button>
              ))}
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
