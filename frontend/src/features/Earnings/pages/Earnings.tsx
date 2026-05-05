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
    { label: 'Total Earnings', value: '₹4,85,000', change: '+15%', icon: <WalletIcon />, color: '#7c3aed' },
    { label: 'Pending Payouts', value: '₹52,000', change: '3 Pending', icon: <TrendingUpIcon />, color: '#f59e0b' },
    { label: 'Next Payout', value: '₹28,500', change: 'Jan 30', icon: <BankIcon />, color: '#0ea5e9' },
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
                    <Typography sx={{ fontWeight: 600, fontSize: '11px', color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'client',
                header: 'Client',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'event',
                header: 'Event',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontSize: '13px', fontWeight: 800, color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'date',
                header: 'Date',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '11px' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => (
                    <Typography 
                        sx={{ 
                            fontWeight: 900, 
                            color: `${theme.palette[cell.getValue() === 'Paid' ? 'success' : cell.getValue() === 'Pending' ? 'warning' : 'info'].main}`, 
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {cell.getValue() as string}
                    </Typography>
                )
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
        muiTopToolbarProps: { sx: { p: '14px' } },
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
                borderRadius: '0',
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
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 2, 
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                }}
            >
                Earnings & Payouts
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1, mb: 2 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <DashboardCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    bgcolor: alpha(stat.color, 0.1),
                                    color: stat.color,
                                    display: 'flex'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', fontSize: '11px' }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 800, mt: 0.5, fontSize: '1.5rem', color: stat.color }}>
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

            <DashboardCard sx={{ mt: 1, p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>Recent Transactions</Typography>
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
