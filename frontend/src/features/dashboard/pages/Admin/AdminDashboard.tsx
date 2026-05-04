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
import { Box, Grid, Typography, Button, Avatar, useTheme, alpha } from "@mui/material";
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';
import Chart from "react-apexcharts";


const AdminDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    {
      label: "Total Vendors",
      value: "1,234",
      change: "+12%",
      icon: BuildingIcon,
      color: theme.palette.primary.main,
      progress: 75,
      trend: "up" as const
    },
    {
      label: "Total Revenue",
      value: "₹45.2L",
      change: "+18%",
      icon: DollarIcon,
      color: theme.palette.success.main,
      progress: 62,
      trend: "up" as const
    },
    {
      label: "Active Clients",
      value: "8,567",
      change: "+23%",
      icon: UsersIcon,
      color: theme.palette.warning.main,
      progress: 88,
      trend: "up" as const
    },
    {
      label: "Bookings",
      value: "456",
      change: "+15%",
      icon: CalendarIcon,
      color: theme.palette.info.main,
      progress: 94,
      trend: "up" as const
    },
  ];

  const recentActivities = [
    {
      name: "Royal Banquet Hall",
      action: "Vendor Verification",
      time: "2 mins ago",
      status: "pending",
      icon: PendingIcon,
      desc: "Updated venue capacity and license documents."
    },
    {
      name: "Priya & Rahul",
      action: "Booking Confirmed",
      time: "15 mins ago",
      status: "success",
      icon: SuccessIcon,
      desc: "Full payment received for Wedding Reception."
    },
    {
      name: "Mahesh Photo",
      action: "Portfolio Update",
      time: "1 hour ago",
      status: "info",
      icon: UploadIcon,
      desc: "Added 24 new high-resolution wedding shots."
    },
  ];

  // const topVendors = [
  //   {
  //     name: "Royal Banquet Hall",
  //     category: "Venue",
  //     bookings: 45,
  //     revenue: "₹12.5L",
  //     rating: 4.9,
  //   },
  //   {
  //     name: "Spice Caterers",
  //     category: "Catering",
  //     bookings: 52,
  //     revenue: "₹15.3L",
  //     rating: 4.7,
  //   },
  // ];

  const actionCards = [
    {
      title: "Verify Assets",
      desc: "Review pending vendor documents and insurance.",
      icon: ShieldIcon,
      color: theme.palette.primary.main,
      count: 12
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
      count: 5
    },
  ];

  return (
    <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 800,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        Admin Dashboard Overview
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardStats {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Area Chart */}
        <Grid item xs={12} md={8}>
          <DashboardCard noPadding sx={{ height: '100%' }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Revenue Analysis</Typography>
              <Typography variant="overline" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>Real-time Data</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={{
                  chart: {
                    type: 'area',
                    toolbar: { show: false },
                    fontFamily: theme.typography.fontFamily,
                  },
                  colors: [theme.palette.primary.main],
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.1,
                      stops: [0, 90, 100]
                    }
                  },
                  stroke: { curve: 'smooth', width: 3 },
                  grid: { borderColor: alpha(theme.palette.divider, 0.5), strokeDashArray: 5 },
                  xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                  },
                  yaxis: {
                    labels: {
                      style: { colors: theme.palette.text.secondary, fontWeight: 600, fontSize: '10px' },
                      formatter: (val: number) => `₹${val}L`
                    }
                  },
                  tooltip: { theme: 'light' }
                }}
                series={[{ name: "Revenue", data: [3.1, 4.0, 3.5, 5.0, 4.9, 6.2, 6.9, 8.1] }]}
                type="area"
                height={350}
              />
            </Box>
          </DashboardCard>
        </Grid>

        {/* Vendor Donut Chart */}
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
                  colors: [
                    theme.palette.primary.main,
                    theme.palette.success.main,
                    theme.palette.warning.main,
                    theme.palette.info.main,
                    '#f472b6',
                    theme.palette.secondary.main
                  ],
                  legend: { position: 'bottom', fontWeight: 600 },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '75%',
                        labels: {
                          show: true,
                          total: { show: true, label: 'Analytics', fontWeight: 800 }
                        }
                      }
                    }
                  },
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
        {/* Recent Activity Log */}
        <Grid item xs={12} md={8}>
          <DashboardCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Recent Platform Activity</Typography>
              <Button variant="text" size="small" sx={{ fontWeight: 700 }}>View All Logs</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivities.map((activity, index) => {
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

        {/* Action Hub */}
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
