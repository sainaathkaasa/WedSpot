import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    ReceiptLong as BillIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { StatusBadge } from '@/shared/ui/StatusBadge';

interface Bill {
    id: string;
    invoiceNumber: string;
    client: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'overdue';
}

const mockBills: Bill[] = [
    { id: '1', invoiceNumber: 'INV-2024-001', client: 'Arjun & Sneha', amount: 450000, date: '2024-03-15', status: 'paid' },
    { id: '2', invoiceNumber: 'INV-2024-002', client: 'Meera & Rohan', amount: 250000, date: '2024-03-18', status: 'pending' },
    { id: '3', invoiceNumber: 'INV-2024-003', client: 'Priya & Vikram', amount: 680000, date: '2024-03-20', status: 'overdue' },
    { id: '4', invoiceNumber: 'INV-2024-004', client: 'Amit & Ritu', amount: 125000, date: '2024-03-22', status: 'pending' },
    { id: '5', invoiceNumber: 'INV-2024-001', client: 'Arjun & Sneha', amount: 450000, date: '2024-03-15', status: 'paid' },
    { id: '6', invoiceNumber: 'INV-2024-002', client: 'Meera & Rohan', amount: 250000, date: '2024-03-18', status: 'pending' },
    { id: '7', invoiceNumber: 'INV-2024-003', client: 'Priya & Vikram', amount: 680000, date: '2024-03-20', status: 'overdue' },
    { id: '8', invoiceNumber: 'INV-2024-004', client: 'Amit & Ritu', amount: 125000, date: '2024-03-22', status: 'pending' },
    { id: '9', invoiceNumber: 'INV-2024-001', client: 'Arjun & Sneha', amount: 450000, date: '2024-03-15', status: 'paid' },
    { id: '10', invoiceNumber: 'INV-2024-002', client: 'Meera & Rohan', amount: 250000, date: '2024-03-18', status: 'pending' },
    { id: '11', invoiceNumber: 'INV-2024-003', client: 'Priya & Vikram', amount: 680000, date: '2024-03-20', status: 'overdue' },
    { id: '12', invoiceNumber: 'INV-2024-004', client: 'Amit & Ritu', amount: 125000, date: '2024-03-22', status: 'pending' },
];

const BillsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'invoiceNumber',
                header: 'Invoice #',
                Cell: ({ row }: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <BillIcon sx={{ color: 'text.disabled', fontSize: 14 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: theme.typography.caption.fontSize, color: 'text.secondary' }}>{row.original.invoiceNumber}</Typography>
                    </Box>
                ),
            },
            {
                accessorKey: 'client',
                header: 'Client / Event',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 600, fontSize: theme.typography.body2.fontSize, color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                ),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 800, color: 'text.primary', fontSize: theme.typography.body2.fontSize }}>
                        {formatCurrency(cell.getValue() as number)}
                    </Typography>
                ),
            },
            {
                accessorKey: 'date',
                header: 'Due Date',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: theme.typography.caption.fontSize }}>{cell.getValue() as string}</Typography>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => (
                    <StatusBadge status={cell.getValue() as string} variant="bill" />
                ),
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
                ),
            },
        ],
        [theme]
    );

    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);

    const table = useMaterialReactTable({
        muiTopToolbarProps: { sx: { p: theme.spacing(1.75) } },
        columns,
        data: mockBills,
        enableColumnActions: false,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableRowSelection: true,
        enableGlobalFilter: true,
        onGlobalFilterChange: setGlobalFilter,
        onShowGlobalFilterChange: setShowGlobalFilter,
        initialState: {
            pagination: { pageSize: 10, pageIndex: 0 },
        },
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
                invoiceNumber: !isMobile,
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
                Bills Management
            </Typography>
            <DashboardCard sx={{ mt: 1, p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: theme.spacing(1.75), display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}`, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Invoices</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TableHeaderToolbar
                            table={table}
                            isSmall
                            ExcelData={{
                                data: mockBills,
                                fileName: 'Bills_Export'
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

export default BillsPage;
