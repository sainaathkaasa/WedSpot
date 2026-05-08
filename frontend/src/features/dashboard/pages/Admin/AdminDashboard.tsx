import React from "react";
import {
  People as UsersIcon,
  Business as BuildingIcon,
  AttachMoney as DollarIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { Box, Grid, useTheme, alpha, CircularProgress } from "@mui/material";
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API } from "@/features/dashboard/api/dashboard.api";


import {
  Timeline as TimelineIcon} from "@mui/icons-material";
import { Button } from "@mui/material";

const AdminDashboard: React.FC = () => {
  const theme = useTheme();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: DASHBOARD_API.getAdminMetrics,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: theme.spacing(50) }}>
        <CircularProgress size={32} thickness={5} />
      </Box>
    );
  }

  const metrics = dashboardData?.data?.metrics || {};
  const chartData = dashboardData?.data?.chartData || [];

  const stats = [
    {
      label: "Total Vendors",
      value: metrics.totalVendors?.toLocaleString() || "0",
      change: `${(metrics.totalVendorsChange ?? 0) >= 0 ? '+' : ''}${(metrics.totalVendorsChange ?? 0).toFixed(1)}%`,
      icon: BuildingIcon,
      color: theme.palette.primary.main,
      trend: ((metrics.totalVendorsChange ?? 0) >= 0 ? "up" : "down") as const
    },
    {
      label: "Total Revenue",
      value: `₹${((metrics.totalRevenue || 0) / 100000).toFixed(1)}L`,
      change: `${(metrics.totalRevenueChange ?? 0) >= 0 ? '+' : ''}${(metrics.totalRevenueChange ?? 0).toFixed(1)}%`,
      icon: DollarIcon,
      color: theme.palette.success.main,
      trend: ((metrics.totalRevenueChange ?? 0) >= 0 ? "up" : "down") as const
    },
    {
      label: "Active Users",
      value: (metrics.totalUsers || "0").toString(),
      change: `${(metrics.totalUsersChange ?? 0) >= 0 ? '+' : ''}${(metrics.totalUsersChange ?? 0).toFixed(1)}%`,
      icon: UsersIcon,
      color: theme.palette.warning.main,
      trend: ((metrics.totalUsersChange ?? 0) >= 0 ? "up" : "down") as const
    },
    {
      label: "Bookings",
      value: (metrics.totalBookings || "0").toString(),
      change: `${(metrics.totalBookingsChange ?? 0) >= 0 ? '+' : ''}${(metrics.totalBookingsChange ?? 0).toFixed(1)}%`,
      icon: CalendarIcon,
      color: theme.palette.info.main,
      trend: ((metrics.totalBookingsChange ?? 0) >= 0 ? "up" : "down") as const
    },
  ];

  const chartCategories = chartData.map((d: any) => d.name);
  const chartValues = chartData.map((d: any) => d.revenue || d.bookings || 0);

  return (
    <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
      <Grid container spacing={theme.spacing(2) === '16px' ? 2 : 2} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardStats {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <DashboardCard 
            noPadding 
            sx={{ height: '100%' }}
            title="Revenue Analysis"
            icon={<TimelineIcon />}
            actions={
              <>
                <Button variant="ghost" size="small" sx={{ fontSize: '0.7rem', py: 0.5 }}>Daily</Button>
                <Button variant="contained" size="small" sx={{ fontSize: '0.7rem', py: 0.5 }}>Monthly</Button>
              </>
            }
          >
            <Chart
              options={{
                chart: { type: 'area', toolbar: { show: false }, fontFamily: theme.typography.fontFamily },
                colors: [theme.palette.primary.main],
                fill: { 
                  type: 'gradient', 
                  gradient: { 
                    shadeIntensity: 1, 
                    opacityFrom: 0.2, 
                    opacityTo: 0, 
                    stops: [0, 90, 100] 
                  } 
                },
                stroke: { curve: 'smooth', width: 2 },
                grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
                xaxis: {
                  categories: chartCategories.length > 0 ? chartCategories : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: { style: { colors: theme.palette.text.secondary, fontSize: '11px', fontWeight: 500 } }
                },
                yaxis: {
                  labels: {
                    style: { colors: theme.palette.text.secondary, fontSize: '11px', fontWeight: 500 },
                    formatter: (val: number) => `₹${val}L`
                  }
                },
                tooltip: { theme: 'light' }
              }}
              series={[{ name: "Revenue", data: chartValues.length > 0 ? chartValues : [3.1, 4.0, 3.5, 5.0, 4.9, 6.2] }]}
              type="area"
              height={300}
            />
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard 
            noPadding 
            sx={{ height: '100%' }}
            title="Vendor Distribution"
          >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <Chart
                options={{
                  chart: { type: 'donut', fontFamily: theme.typography.fontFamily },
                  labels: ['Venues', 'Catering', 'Photography', 'Decor', 'Makeup', 'Planners'],
                  colors: [
                    theme.palette.primary.main,
                    theme.palette.success.main,
                    theme.palette.warning.main,
                    theme.palette.info.main,
                    alpha(theme.palette.secondary.main, 0.6),
                    theme.palette.secondary.main
                  ],
                  legend: { position: 'bottom', fontWeight: 600, fontSize: '11px', markers: { strokeWidth: 0 } },
                  plotOptions: { pie: { donut: { size: '80%', labels: { show: true, total: { show: true, label: 'Vendors', fontWeight: 800, fontSize: '13px', color: theme.palette.text.secondary } } } } },
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

    </Box>
  );
};

export default AdminDashboard;
