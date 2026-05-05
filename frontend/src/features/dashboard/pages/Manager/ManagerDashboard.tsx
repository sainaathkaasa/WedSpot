import React from 'react';
import {
  People as UsersIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as DollarIcon,
  TrackChanges as TargetIcon,
} from '@mui/icons-material';
import { Box, Grid, useTheme, CircularProgress } from '@mui/material';
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API } from "@/features/dashboard/api/dashboard.api";

const ManagerDashboard: React.FC = () => {
  const theme = useTheme();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-manager"],
    queryFn: DASHBOARD_API.getManagerMetrics,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const metrics = dashboardData?.data?.metrics || {};

  const stats = [
    { label: 'Team Members', value: (metrics.totalStaff || '0').toString(), change: '+3 new', icon: UsersIcon, color: theme.palette.secondary.main, progress: 80 },
    { label: 'Active Events', value: (metrics.activeBookings || '0').toString(), change: `${metrics.pendingBookings || 0} pending`, icon: CalendarIcon, color: theme.palette.warning.main, progress: 65 },
    { label: 'Op. Budget', value: '₹32L', change: '+15%', icon: DollarIcon, color: theme.palette.success.main, progress: 92 },
    { label: 'Efficiency', value: '94%', change: '+2%', icon: TargetIcon, color: theme.palette.info.main, progress: 94 },
  ];




  return (
    <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardStats {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
