import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    alpha,
    useTheme,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Drawer,
    Chip,
    Stack,
    Tooltip,
    useMediaQuery
} from '@mui/material';
import {
    Description as ReportIcon,
    Download as DownloadIcon,
    ChevronRight as ChevronIcon,
    Timeline as TimelineIcon,
    Assessment as AssessmentIcon,
    PieChart as PieIcon,
    Share as ShareIcon,
    Print as PrintIcon,
    DeleteOutline as ArchiveIcon,
    Close as CloseIcon,
    VerifiedUser as VerifiedIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { DashboardCard } from '@/features/dashboard';

const Reports = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    const reportTypes = [
        {
            title: 'Monthly Performance Review',
            date: 'Feb 2025',
            size: '2.4 MB',
            icon: <TimelineIcon />,
            author: 'Admin Sarah',
            status: 'Approved',
            summary: 'Comprehensive analysis of service delivery metrics and financial performance for the month of February.'
        },
        {
            title: 'Client Feedback Analysis',
            date: 'Jan 2025',
            size: '1.8 MB',
            icon: <AssessmentIcon />,
            author: 'Support Team',
            status: 'Finalized',
            summary: 'Aggregated review data from 150+ wedding events, focusing on vendor satisfaction and application usability.'
        },
        {
            title: 'Vendor Payout Summary',
            date: 'Q1 2025',
            size: '3.1 MB',
            icon: <PieIcon />,
            author: 'Finance Bot',
            status: 'Draft',
            summary: 'Preliminary breakdown of payouts for venues and vendors for the first quarter of 2025.'
        },
        {
            title: 'System Health Report',
            date: 'Weekly',
            size: '512 KB',
            icon: <ReportIcon />,
            author: 'SysOps Admin',
            status: 'Automated',
            summary: 'Automatic diagnostics of server uptime, API latency, and database performance.'
        },
    ];

    const openDetails = (report: any) => {
        setSelectedReport(report);
        setDrawerOpen(true);
    };

    return (
        <Box sx={{ p: 0, maxWidth: theme.dashboard.contentMaxWidth, margin: '0 auto' }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 2,
                    color: 'text.primary'
                }}
            >
                Analytics Reports
            </Typography>

            <Grid container spacing={theme.spacing(3)} sx={{ mt: 1 }}>
                {reportTypes.map((report, index) => (
                    <Grid item xs={12} key={index}>
                        <DashboardCard sx={{
                            p: theme.spacing(1.5),
                            transition: theme.dashboard.transition,
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2.5) }}>
                                    <Box sx={{
                                        p: theme.spacing(1.5),
                                        borderRadius: theme.dashboard.cardRadius,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        display: 'flex'
                                    }}>
                                        {report.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{report.title}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                            {report.date} • {report.size}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: theme.spacing(1.5), alignItems: 'center', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                                    <Button
                                        startIcon={<DownloadIcon />}
                                        variant="outlined"
                                        size="small"
                                        fullWidth={isMobile}
                                        sx={{
                                            borderRadius: theme.shape.borderRadius,
                                            fontWeight: 800,
                                            textTransform: 'none',
                                            px: 2,
                                            height: 36,
                                            borderColor: alpha(theme.palette.divider, 0.2),
                                            transition: theme.dashboard.transition,
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                                        }}
                                    >
                                        Download
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() => openDetails(report)}
                                        sx={{
                                            bgcolor: alpha(theme.palette.divider, 0.05),
                                            height: 36,
                                            width: 36,
                                            transition: theme.dashboard.transition,
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }
                                        }}
                                    >
                                        <ChevronIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </DashboardCard>
                    </Grid>
                ))}
            </Grid>

            {/* Reports Detail Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 400 },
                        bgcolor: 'background.paper',
                        p: 0,
                        borderLeft: `1px solid ${theme.palette.divider}`,
                    }
                }}
            >
                {selectedReport && (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Drawer Header */}
                        <Box sx={{ p: theme.spacing(3), display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                                <Box sx={{ p: theme.spacing(1), bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: theme.shape.borderRadius, display: 'flex' }}>
                                    {selectedReport.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 900 }}>Report Details</Typography>
                            </Box>
                            <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: theme.palette.divider }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Divider />

                        {/* Drawer Content */}
                        <Box sx={{ p: theme.spacing(3), flexGrow: 1, overflowY: 'auto' }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>{selectedReport.title}</Typography>
                            <Chip
                                label={selectedReport.status}
                                size="small"
                                sx={{
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    fontSize: theme.typography.caption.fontSize,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    mb: theme.spacing(3)
                                }}
                            />

                            <Stack spacing={theme.spacing(3)}>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Summary</Typography>
                                    <Typography sx={{ mt: 1, fontWeight: 500, lineHeight: 1.6, color: 'text.secondary', fontSize: theme.typography.body2.fontSize }}>
                                        {selectedReport.summary}
                                    </Typography>
                                </Box>

                                <Box sx={{ p: theme.spacing(2), borderRadius: theme.dashboard.cardRadius, bgcolor: alpha(theme.palette.divider, 0.05) }}>
                                    <Stack spacing={theme.spacing(2)}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                                                <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>Prepared By</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900 }}>{selectedReport.author}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                                                <TimeIcon sx={{ fontSize: 18, color: 'info.main' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>Last Modified</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900 }}>{selectedReport.date}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Drawer Actions */}
                        <Box sx={{ p: theme.spacing(3), display: 'flex', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ShareIcon />}
                                sx={{ borderRadius: theme.shape.borderRadius, fontWeight: 800, textTransform: 'none' }}
                            >
                                Share
                            </Button>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Print">
                                    <IconButton sx={{ bgcolor: alpha(theme.palette.divider, 0.1), borderRadius: theme.shape.borderRadius }}><PrintIcon /></IconButton>
                                </Tooltip>
                                <Tooltip title="Archive">
                                    <IconButton sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', borderRadius: theme.shape.borderRadius }}><ArchiveIcon /></IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Drawer>

            <Box sx={{ mt: theme.spacing(2) }}>
                <DashboardCard sx={{ px: theme.spacing(3), py: theme.spacing(3) }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: theme.spacing(3), color: 'text.primary' }}>Recent Report Requests</Typography>
                    <List disablePadding>
                        {[1, 2, 3].map((_, i) => (
                            <Box key={i}>
                                <ListItem
                                    sx={{ py: theme.spacing(2) }}
                                    secondaryAction={
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                fontWeight: 900,
                                                color: 'text.disabled',
                                                fontSize: theme.typography.caption.fontSize
                                            }}
                                        >
                                            Queued
                                        </Typography>
                                    }
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <ReportIcon color="action" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`Custom Report Request #${1024 + i}`}
                                        secondary="Requested by Admin • Processing"
                                        primaryTypographyProps={{ variant: 'subtitle2', sx: { fontWeight: 700 } }}
                                    />
                                </ListItem>
                                {i < 2 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </DashboardCard>
            </Box>
        </Box>
    );
};


export default Reports;
