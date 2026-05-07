import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    alpha,
    useTheme,
    useMediaQuery,
    IconButton
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

const stats = [
    { label: 'Total Earnings', value: '₹4,85,000', change: '+15%', icon: <WalletIcon />, color: 'primary' as const },
    { label: 'Pending Payouts', value: '₹52,000', change: '3 Pending', icon: <TrendingUpIcon />, color: 'warning' as const },
    { label: 'Next Payout', value: '₹28,500', change: 'Jan 30', icon: <BankIcon />, color: 'info' as const },
];

const transactions = [
    { id: 'TXN-901', client: 'Priya Sharma', event: 'Wedding Venue', amount: '₹1,20,000', status: 'Paid', date: '2025-01-15' },
    { id: 'TXN-902', client: 'Rahul Varma', event: 'Engagement', amount: '₹35,000', status: 'Pending', date: '2025-01-18' },
    { id: 'TXN-903', client: 'Anita Roy', event: 'Birthday Decor', amount: '₹15,000', status: 'Processing', date: '2025-01-19' },
];

const EarningsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Transaction ID',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 600, fontSize: theme.typography.caption.fontSize, color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'client',
                header: 'Client',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 800, fontSize: theme.typography.body2.fontSize, color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'event',
                header: 'Event',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: theme.typography.caption.fontSize }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontSize: theme.typography.body2.fontSize, fontWeight: 800, color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'date',
                header: 'Date',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: theme.typography.caption.fontSize }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => {
                    const status = cell.getValue() as string;
                    const colorMap: Record<string, 'success' | 'warning' | 'info'> = {
                        'Paid': 'success',
                        'Pending': 'warning',
                        'Processing': 'info'
                    };
                    return (
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: `${theme.palette[colorMap[status] || 'info'].main}`,
                                fontSize: theme.typography.caption.fontSize,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {status}
                        </Typography>
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
        muiTopToolbarProps: { sx: { p: theme.spacing(1.75) } },
        columns,
        data: transactions,
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
            sx: {
                borderRadius: 0,
                border: 'none',
            },
        },
        state: {
            globalFilter,
            showGlobalFilter,
            columnVisibility: {
                id: !isMobile,
                event: !isMobile,
                date: !isMobile,
            }
        },
    });

    return (
        <Box sx={{ p: 0, maxWidth: theme.dashboard.contentMaxWidth, margin: '0 auto' }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 2,
                    color: 'text.primary'
                }}
            >
                Earnings & Payouts
            </Typography>
            <Grid container spacing={theme.spacing(3)} sx={{ mt: 1, mb: 2 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2.5) }}>
                                <Box sx={{
                                    p: theme.spacing(1.5),
                                    borderRadius: theme.dashboard.cardRadius,
                                    bgcolor: alpha(theme.palette[stat.color].main, 0.1),
                                    color: `${stat.color}.main`,
                                    display: 'flex'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', fontSize: theme.typography.caption.fontSize }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, mt: 0.5, fontSize: '1.5rem', color: `${stat.color}.main` }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: theme.typography.caption.fontSize }}>
                                        <ArrowUpIcon sx={{ fontSize: 12 }} /> {stat.change}
                                    </Typography>
                                </Box>
                            </Box>
                        </DashboardCard>
                    </Grid>
                ))}
            </Grid>

            <DashboardCard sx={{ mt: 1, p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: theme.spacing(1.75), display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: theme.typography.body2.fontSize, color: 'text.primary' }}>Recent Transactions</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TableHeaderToolbar
                            table={table}
                            isSmall
                            ExcelData={{
                                data: transactions,
                                fileName: 'Earnings_Report'
                            }}
                        />
                    </Box>
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};


export default EarningsPage;
