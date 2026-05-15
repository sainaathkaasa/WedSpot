import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    alpha,
    Stack,
    Tooltip,
} from '@mui/material';
import {
    CloudDownload as DownloadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BILLS_API } from '../api/bills.api';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { getErrorMessage } from '@/lib/error';

interface Bill {
    id: number;
    invoiceNumber: string;
    client: { name: string; email: string };
    amount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | string;
    date: string;
}

const BillsPage = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { success, error: showError } = useSnackbar();

    // Fetch Bills
    const { data: bills = [], isLoading } = useQuery<Bill[]>({
        queryKey: ['bills'],
        queryFn: async () => {
            const response = await BILLS_API.getAll();
            return response.data || [];
        }
    });

    const deleteMutation = useMutation({
        mutationFn: BILLS_API.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bills'] });
            success('Bill deleted');
        },
        onError: (err) => showError(getErrorMessage(err))
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'invoiceNumber',
                header: 'Invoice #',
                Cell: ({ cell }: any) => (
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {cell.getValue() as string}
                    </Typography>
                )
            },
            {
                accessorKey: 'client.name',
                header: 'Client',
                Cell: ({ row }: any) => (
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.original.client?.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.original.client?.email}</Typography>
                    </Box>
                )
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                Cell: ({ cell }: any) => (
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        ₹{(cell.getValue() as number).toLocaleString()}
                    </Typography>
                )
            },
            {
                accessorKey: 'date',
                header: 'Date',
                Cell: ({ cell }: any) => (
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {new Date(cell.getValue() as string).toLocaleDateString()}
                    </Typography>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => {
                    const status = (cell.getValue() as string).toUpperCase();
                    const colors: any = {
                        PAID: 'success',
                        PENDING: 'warning',
                        OVERDUE: 'error'
                    };
                    const colorKey = (colors[status] || 'info') as 'success' | 'warning' | 'error' | 'info';
                    return (
                        <Box sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: '4px', 
                            bgcolor: alpha(theme.palette[colorKey].main, 0.1),
                            color: theme.palette[colorKey].main,
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
                size: 100,
                enableColumnFilter: false,
                enableSorting: false,
                Cell: ({ row }: any) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Download PDF">
                            <IconButton size="small" color="primary">
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => {
                                    if (window.confirm('Delete this bill?')) {
                                        deleteMutation.mutate(row.original.id);
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )
            }
        ],
        [theme, deleteMutation]
    );

    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);

    const table = useMaterialReactTable({
        columns,
        data: bills,
        state: { globalFilter, showGlobalFilter, isLoading },
        onGlobalFilterChange: setGlobalFilter,
        onShowGlobalFilterChange: setShowGlobalFilter,
        enableRowSelection: true,
        muiTablePaperProps: { elevation: 0 },
    });

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Billing & Invoices
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                    Monitor payments, issue invoices, and track financial records.
                </Typography>
            </Box>

            <DashboardCard noPadding sx={{ overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TableHeaderToolbar 
                        table={table} 
                        isSmall 
                        ExcelData={{ data: bills, fileName: 'Bills_Export' }}
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default BillsPage;
