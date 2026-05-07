import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Avatar,
    alpha,
    useTheme
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';

import { useQuery } from '@tanstack/react-query';
import { USER_SERVICE } from '@/features/Users/api/user.api';

const ClientsPage = () => {
    const theme = useTheme();

    const { data: clients = [], isLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: () => USER_SERVICE.getAllUsers(),
        select: (response) =>
            response.data?.filter(user => user.role?.toUpperCase() === 'CLIENT') ?? []
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Client Name',
                Cell: ({ row }: any) => {
                    const client = row.original;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                            <Avatar sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.08), 
                                color: 'primary.main', 
                                fontWeight: 700, 
                                width: 32, 
                                height: 32, 
                                fontSize: '0.8rem' 
                            }}>
                                {client.name?.charAt(0) || <PersonIcon sx={{ fontSize: 16 }} />}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{client.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>ID: {client.id?.substring(0, 8)}...</Typography>
                            </Box>
                        </Box>
                    );
                }
            },
            {
                id: 'contact',
                accessorFn: (row: any) => `${row.email} ${row.phoneNumber}`,
                header: 'Contact Info',
                Cell: ({ row }: any) => {
                    const client = row.original;
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{client.email}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{client.phoneNumber || 'No phone'}</Typography>
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'createdAt',
                header: 'Joined Date',
                Cell: ({ cell }: any) => {
                    const date = cell.getValue();
                    return (
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            {date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                        </Typography>
                    )
                }
            },
            {
                accessorKey: 'enabled',
                header: 'Status',
                Cell: ({ cell }: any) => {
                    const enabled = cell.getValue() as boolean;
                    return (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                px: 1.25,
                                py: 0.5,
                                borderRadius: theme.shape.borderRadius,
                                bgcolor: enabled ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.text.disabled, 0.1),
                                color: enabled ? 'success.main' : 'text.disabled',
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.02em' }}>
                                {enabled ? 'Active' : 'Inactive'}
                            </Typography>
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
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                )
            }
        ],
        [theme]
    );

    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);

    const table = useMaterialReactTable({
        muiTopToolbarProps: { sx: { p: theme.spacing(1.5) } },
        columns,
        data: clients,
        enableColumnActions: false,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableRowSelection: true,
        enableGlobalFilter: true,
        onGlobalFilterChange: setGlobalFilter,
        onShowGlobalFilterChange: setShowGlobalFilter,
        state: {
            globalFilter,
            showGlobalFilter,
            isLoading,
        },
        initialState: {
            pagination: { pageSize: 10, pageIndex: 0 },
        },
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '0',
                border: 'none',
            },
        },
    });

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <DashboardCard 
                noPadding 
                sx={{ mt: 1 }}
                title="Client Management"
                subtitle="View and manage all registered clients on the platform."
                actions={
                    <TableHeaderToolbar
                        table={table}
                        isSmall
                        ExcelData={{
                            data: clients,
                            fileName: 'Clients_Export'
                        }}
                    />
                }
            >
                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default ClientsPage;
