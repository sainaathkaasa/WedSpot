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
import { Box, Grid, Typography, Button, Avatar, LinearProgress, useTheme, alpha } from '@mui/material';
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';
import Chart from "react-apexcharts";

const ClientDashboard: React.FC = () => {
  const theme = useTheme();

  const weddingDetails = {
    bride: 'Priya',
    groom: 'Rahul',
    date: 'January 15, 2025',
    venue: 'Royal Banquet Hall, Mumbai',
    daysLeft: 40,
    guests: 350,
    progress: 68
  };

  const budgetStats = [
    {
      label: 'Wedding Budget',
      value: '₹15L',
      icon: GiftIcon,
      color: theme.palette.secondary.main,
      progress: 55
    },
    {
      label: 'Total Spent',
      value: '₹8.2L',
      icon: CheckCircleIcon,
      color: theme.palette.success.main,
      progress: 60
    },
    {
      label: 'Confirmed',
      value: '8/12',
      icon: UsersIcon,
      color: theme.palette.warning.main,
      progress: 75
    },
    {
      label: 'Days Remaining',
      value: '40',
      icon: ClockIcon,
      color: theme.palette.error.main,
      progress: 100
    },
  ];

  const bookedVendors = [
    {
      name: 'Royal Banquet',
      category: 'Venue & Catering',
      status: 'confirmed',
      amount: '₹3.5L',
      icon: MapPinIcon,
      date: 'Jan 15, 2025'
    },
    {
      name: 'Mahesh Photo',
      category: 'Cinematography',
      status: 'confirmed',
      amount: '₹1.2L',
      icon: CameraIcon,
      date: 'Jan 15, 2025'
    },
  ];

  const actionCards = [
    {
      title: 'Marketplace',
      desc: 'Discover and book curated premium vendors.',
      icon: UsersIcon,
      color: theme.palette.secondary.main,
      count: 'New'
    },
    {
      title: 'Budgeter',
      desc: 'Real-time expense and payment tracking.',
      icon: GiftIcon,
      color: theme.palette.success.main,
      count: null
    },
    {
      title: 'Timeline',
      desc: 'Chronological roadmap of your big day.',
      icon: CalendarIcon,
      color: theme.palette.warning.main,
      count: null
    },
  ];

  return (
    <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ 
          mb: 2, 
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>Client Dashboard</Typography>
      {/* Hero Header Section */}
      <DashboardCard
        sx={{
          mb: 4,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          borderColor: alpha(theme.palette.secondary.main, 0.2),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <HeartIcon sx={{ color: theme.palette.secondary.main }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Wedding Journey
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
              {weddingDetails.bride} & {weddingDetails.groom}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <CalendarIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{weddingDetails.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <MapPinIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{weddingDetails.venue}</Typography>
              </Box>
            </Box>

            <Box sx={{ maxWidth: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Planning Progress</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>{weddingDetails.progress}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={weddingDetails.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.secondary.main,
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          </Box>

          <Box sx={{
            textAlign: 'center',
            p: 3,
            borderRadius: '24px',
            background: 'white',
            boxShadow: theme.shadows[10],
            border: `1px solid ${theme.dashboard.glassBorder}`,
            minWidth: 160
          }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: theme.palette.secondary.main, lineHeight: 1 }}>
              {weddingDetails.daysLeft}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
              Days To Go
            </Typography>
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
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.secondary.main, 
                    textTransform: 'uppercase', 
                    fontSize: '0.65rem' 
                  }}
                >
                  Allocated: ₹15L
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700, 
                    color: theme.palette.success.main, 
                    textTransform: 'uppercase', 
                    fontSize: '0.65rem' 
                  }}
                >
                  Spent: ₹8.2L
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                    fontFamily: theme.typography.fontFamily,
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 10,
                      columnWidth: '40%',
                      distributed: false,
                    }
                  },
                  colors: [theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main],
                  dataLabels: { enabled: false },
                  grid: { borderColor: alpha(theme.palette.divider, 0.5), strokeDashArray: 5 },
                  xaxis: {
                    categories: ['Catering', 'Venue', 'Decor', 'Photography', 'Invitations'],
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                  },
                  legend: { show: true, fontWeight: 600 },
                  tooltip: { theme: 'light' }
                }}
                series={[
                  {
                    name: "Allocated",
                    data: [300000, 500000, 200000, 300000, 100000]
                  },
                  {
                    name: "Spent",
                    data: [250000, 350000, 80000, 120000, 20000]
                  }
                ]}
                type="bar"
                height={350}
              />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>


      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <DashboardCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Booked Vendors</Typography>
              <Button variant="text" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>Manage All</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {bookedVendors.map((vendor, index) => (
                <Box key={index} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '16px',
                  border: `1px solid ${theme.dashboard.glassBorder}`,
                  background: 'rgba(255,255,255,0.4)'
                }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, mr: 2 }}>
                    <vendor.icon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 700 }}>{vendor.name}</Typography>
                      <Typography sx={{ fontWeight: 700, color: theme.palette.success.main }}>{vendor.amount}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {vendor.category} • {vendor.date}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'success.main', 
                      textTransform: 'uppercase', 
                      fontSize: '0.65rem',
                      ml: 2
                    }}
                  >
                    {vendor.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DashboardCard sx={{ bgcolor: '#0f172a', color: 'white' }}>
              <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800, 
            mb: 4, 
            letterSpacing: '-0.02em',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          My Wedding Journey
        </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {actionCards.map((card, index) => (
                  <Button key={index} fullWidth sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    color: 'inherit'
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: alpha(card.color, 0.2),
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <card.icon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{card.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{card.desc}</Typography>
                    </Box>
                    {card.count && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 700, 
                          color: 'primary.main', 
                          textTransform: 'uppercase', 
                          fontSize: '0.65rem' 
                        }}
                      >
                        {card.count}
                      </Typography>
                    )}
                  </Button>
                ))}
              </Box>
            </DashboardCard>

            <DashboardCard sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, width: 60, height: 60 }}>
                <CakeIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Planning Tools</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                You've confirmed 68% of your wedding essentials. Almost there!
              </Typography>
            </DashboardCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDashboard;
