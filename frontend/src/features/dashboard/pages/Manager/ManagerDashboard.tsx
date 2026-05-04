import React from 'react';
import {
  People as UsersIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as DollarIcon,
  Assignment as ClipboardIcon,
  Warning as AlertIcon,
  TrackChanges as TargetIcon,
} from '@mui/icons-material';
import { Box, Grid, Typography, Button, Avatar, LinearProgress, Stack, Paper, useTheme, alpha } from '@mui/material';
import DashboardStats from "@/features/dashboard/components/DashboardStats/DashboardStats";
import { DashboardCard } from '@/features/dashboard';

const ManagerDashboard: React.FC = () => {
  const theme = useTheme();

  const stats = [
    {
      label: 'Team Members',
      value: '24',
      change: '+3 new',
      icon: UsersIcon,
      color: theme.palette.secondary.main,
      progress: 80
    },
    {
      label: 'Active Events',
      value: '18',
      change: '5 today',
      icon: CalendarIcon,
      color: theme.palette.warning.main,
      progress: 65
    },
    {
      label: 'Op. Budget',
      value: '₹32L',
      change: '+15%',
      icon: DollarIcon,
      color: theme.palette.success.main,
      progress: 92
    },
    {
      label: 'Efficiency',
      value: '94%',
      change: '+2%',
      icon: TargetIcon,
      color: theme.palette.info.main,
      progress: 94
    },
  ];

  const teamPerformance = [
    {
      name: 'Rajesh Kumar',
      role: 'Event Lead',
      tasksCompleted: 45,
      tasksTotal: 48,
      efficiency: 94,
      status: 'excellent'
    },
    {
      name: 'Priya Sharma',
      role: 'Coordinator',
      tasksCompleted: 38,
      tasksTotal: 42,
      efficiency: 90,
      status: 'good'
    },
  ];

  const upcomingEvents = [
    {
      event: 'Priya & Rahul Wedding',
      date: 'Today',
      time: '18:00',
      team: 8,
      status: 'live',
      venue: 'Royal Banquet'
    },
    {
      event: 'Anita Engagement',
      date: 'Tomorrow',
      time: '17:00',
      team: 6,
      status: 'ready',
      venue: 'Garden Palace'
    },
  ];

  const actionCards = [
    {
      title: 'Assign Staff',
      desc: 'Deploy teams to upcoming venues.',
      icon: ClipboardIcon,
      color: theme.palette.secondary.main,
      count: 3
    },
    {
      title: 'Review Budget',
      desc: 'Analyze and approve event expenses.',
      icon: DollarIcon,
      color: theme.palette.success.main,
      count: null
    },
    {
      title: 'Safety Logs',
      desc: 'Monitor on-site compliance reports.',
      icon: AlertIcon,
      color: theme.palette.warning.main,
      count: 1
    },
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
          Operations Management
        </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardStats {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Active Personnel */}
        <Grid item xs={12} md={6}>
          <DashboardCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Active Personnel</Typography>
              <Button variant="text" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>View All Staff</Button>
            </Box>
            <Stack spacing={2}>
              {teamPerformance.map((member, index) => (
                <Paper key={index} sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'white',
                  border: `1px solid ${theme.dashboard.glassBorder}`,
                  boxShadow: 'none'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{member.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{member.role}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 800, color: member.efficiency > 90 ? theme.palette.success.main : theme.palette.primary.main, fontSize: '1.1rem' }}>
                        {member.efficiency}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Score</Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={member.efficiency}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: member.efficiency > 90 ? theme.palette.success.main : theme.palette.primary.main,
                        borderRadius: 3,
                      }
                    }}
                  />
                </Paper>
              ))}
            </Stack>
          </DashboardCard>
        </Grid>

        {/* Event Pipeline */}
        <Grid item xs={12} md={6}>
          <DashboardCard sx={{ height: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: 'text.primary' }}>Upcoming Schedule</Typography>
            <Stack spacing={2}>
              {upcomingEvents.map((event, index) => (
                <Box key={index} sx={{
                  p: 2,
                  borderRadius: '20px',
                  border: `1px solid ${theme.dashboard.glassBorder}`,
                  background: 'white'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{event.event}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{event.venue}</Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 900, 
                        color: event.status === 'live' ? 'success.main' : 'info.main', 
                        textTransform: 'uppercase', 
                        fontSize: '0.65rem' 
                      }}
                    >
                      {event.status}
                    </Typography>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: '#f8fafc',
                    borderRadius: '12px'
                  }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600 }}>
                        <CalendarIcon sx={{ fontSize: 14 }} /> {event.date}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600 }}>
                        <TargetIcon sx={{ fontSize: 14 }} /> {event.time}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: theme.palette.secondary.main }}>👥 {event.team} Staff</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Workflow Hub */}
      <DashboardCard sx={{ bgcolor: '#0f172a', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Workflow Hub</Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 900, 
              color: 'white', 
              textTransform: 'uppercase', 
              fontSize: '0.65rem' 
            }}
          >
            Active Control Mode
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {actionCards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Button fullWidth sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                textTransform: 'none',
                p: 2,
                borderRadius: '16px',
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                color: 'inherit'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(card.color, 0.2), color: card.color, borderRadius: '12px' }}>
                    <card.icon />
                  </Avatar>
                  {card.count && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 900, 
                        color: 'white', 
                        textTransform: 'uppercase', 
                        fontSize: '0.65rem' 
                      }}
                    >
                      {card.count} Pending
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{card.title}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, textAlign: 'left', lineHeight: 1.4 }}>
                  {card.desc}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </DashboardCard>
    </Box>
  );
};

export default ManagerDashboard;
