import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Avatar,
    alpha,
    useTheme,
    Button
} from '@mui/material';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    MoreVert as MoreVertIcon
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', fontWeight: 700 }}>
                                {client.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{client.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ID: {client.id}</Typography>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{client.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{client.phoneNumber || 'N/A'}</Typography>
                            </Box>
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
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary' }}>
                            {date ? new Date(date).toLocaleDateString() : 'N/A'}
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
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 900,
                                color: enabled ? 'success.main' : 'text.disabled',
                                textTransform: 'uppercase',
                                fontSize: '0.65rem'
                            }}
                        >
                            {enabled ? 'Active' : 'Inactive'}
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
                            <MoreVertIcon fontSize="small" />
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
                Client Management
            </Typography>
            <DashboardCard sx={{ mt: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}` }}>
                    <Button variant="contained" size="small" sx={{ borderRadius: '10px' }}>Add New Client</Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TableHeaderToolbar
                            table={table}
                            isSmall
                            ExcelData={{
                                data: clients,
                                fileName: 'Clients_Export'
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

export default ClientsPage;
