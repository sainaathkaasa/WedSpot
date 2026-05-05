import React from 'react';
import {
  Assignment as ClipboardIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Chat as MessageIcon,
} from '@mui/icons-material';
import { Box, Grid, useTheme, CircularProgress } from '@mui/material';
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_API } from "@/features/dashboard/api/dashboard.api";

const StaffDashboard: React.FC = () => {
  const theme = useTheme();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-staff"],
    queryFn: DASHBOARD_API.getStaffMetrics,
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
    { label: 'Tasks Today', value: (metrics.pendingTasks || '0').toString(), change: `${metrics.upcomingEvents || 0} pending`, icon: ClipboardIcon, color: theme.palette.secondary.main, progress: 40 },
    { label: 'Weekly Goal', value: (metrics.completedEvents || '0').toString(), change: '+12% efficiency', icon: CheckCircleIcon, color: theme.palette.success.main, progress: 85 },
    { label: 'Active Events', value: (metrics.upcomingEvents || '0').toString(), change: 'on-site', icon: CalendarIcon, color: theme.palette.warning.main, progress: 100 },
    { label: 'Team Alert', value: '8', change: '2 urgent', icon: MessageIcon, color: theme.palette.error.main, progress: 60 },
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

export default StaffDashboard;
