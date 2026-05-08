import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    alpha,
    useTheme,
    useMediaQuery,
    IconButton,
    CircularProgress,
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    Wallet as WalletIcon,
    TrendingUp as TrendingUpIcon,
    AccountBalance as BankIcon,
    ArrowUpward as ArrowUpIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_API } from '@/features/dashboard/api/dashboard.api';
import { useUser } from '@/features/user/context/useUser';
import { BOOKING_SERVICE } from '@/features/Booking/api';

const EarningsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useUser();

    // Fetch Vendor Metrics
    const { data: dashboardResponse, isLoading: isMetricsLoading } = useQuery({
        queryKey: ['dashboard-vendor', user?.id],
        queryFn: () => DASHBOARD_API.getVendorMetrics(user?.id || 0),
        enabled: !!user?.id,
    });

    // Fetch Recent Bookings for Transaction List
    const { data: bookingsResponse, isLoading: isBookingsLoading } = useQuery({
        queryKey: ['bookings', 'vendor', user?.id],
        queryFn: () => BOOKING_SERVICE.getVendorBooking(user?.id || 0),
        enabled: !!user?.id,
    });

    const metrics = dashboardResponse?.data?.metrics || {};
    const bookings = bookingsResponse?.data || [];

    const stats = useMemo(() => [
        { label: 'Total Earnings', value: `₹${(metrics.totalEarnings || 0).toLocaleString()}`, change: '+15%', icon: <WalletIcon />, color: 'primary' as const },
        { label: 'Pending Bookings', value: (metrics.pendingBookings || 0).toString(), change: 'Action Req', icon: <TrendingUpIcon />, color: 'warning' as const },
        { label: 'Avg Rating', value: Number(metrics.avgRating || 0).toFixed(1), change: `${metrics.totalReviews || 0} Reviews`, icon: <BankIcon />, color: 'info' as const },
    ], [metrics]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary' }}>#{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'client.name',
                header: 'Client',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 800, fontSize: '12px', color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'totalAmount',
                header: 'Amount',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontSize: '12px', fontWeight: 800, color: 'text.primary' }}>₹{(cell.getValue() as number).toLocaleString()}</Typography>
                )
            },
            {
                accessorKey: 'eventDate',
                header: 'Date',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '11px' }}>{new Date(cell.getValue() as string).toLocaleDateString()}</Typography>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => {
                    const status = cell.getValue() as string;
                    const colorMap: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
                        'COMPLETED': 'success',
                        'PENDING': 'warning',
                        'CONFIRMED': 'info',
                        'CANCELLED': 'error'
                    };
                    return (
                        <Box sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: '4px', 
                            bgcolor: alpha(theme.palette[colorMap[status] || 'info'].main, 0.1),
                            color: theme.palette[colorMap[status] || 'info'].main,
                            fontSize: '10px',
                            fontWeight: 900,
                            display: 'inline-block',
                            textTransform: 'uppercase'
                        }}>
                            {status}
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                muiTableHeadCellProps: { align: 'center' as const },
                muiTableBodyCellProps: { align: 'center' as const },
                enableColumnFilter: false,
                enableSorting: false,
                Cell: () => (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton size="small">
                            <MoreIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )
            }
        ],
        [theme]
    );

    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);

    const table = useMaterialReactTable({
        columns,
        data: bookings,
        enableColumnActions: false,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableRowSelection: true,
        enableGlobalFilter: true,
        onGlobalFilterChange: setGlobalFilter,
        onShowGlobalFilterChange: setShowGlobalFilter,
        muiTablePaperProps: {
            elevation: 0,
            sx: { borderRadius: 0, border: 'none' },
        },
        state: {
            globalFilter,
            showGlobalFilter,
            isLoading: isBookingsLoading,
            columnVisibility: {
                id: !isMobile,
                date: !isMobile,
            }
        },
    });

    if (isMetricsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={40} thickness={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Earnings & Payouts
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                    Track your income, pending payments, and service performance.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Box sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette[stat.color].main, 0.1),
                                    color: `${stat.color}.main`,
                                    display: 'flex'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, mt: 0.5, fontSize: '1.5rem', color: 'text.primary' }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px' }}>
                                        <ArrowUpIcon sx={{ fontSize: 12 }} /> {stat.change}
                                    </Typography>
                                </Box>
                            </Box>
                        </DashboardCard>
                    </Grid>
                ))}
            </Grid>

            <DashboardCard 
                title="Recent Transactions" 
                subtitle="Historical list of all payments and bookings"
                noPadding
                sx={{ overflow: 'hidden' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TableHeaderToolbar
                        table={table}
                        isSmall
                        ExcelData={{
                            data: bookings,
                            fileName: 'Earnings_Report'
                        }}
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default EarningsPage;
