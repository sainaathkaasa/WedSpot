import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    alpha,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';

import { useQuery } from '@tanstack/react-query';
import { USER_SERVICE } from '@/features/Users/api/user.api';

const Staff = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: staffMembers = [], isLoading } = useQuery({
        queryKey: ['staff'],
        queryFn: () => USER_SERVICE.getAllUsers(),
        select: (response) =>
            response.data?.filter(user => user.role?.toUpperCase() === 'STAFF') ?? []
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Staff ID',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, fontSize: '12px', color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'name',
                header: 'Staff Name',
                Cell: ({ row }: any) => {
                    const member = row.original;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>{member.name}</Typography>
                            </Box>
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'role',
                header: 'Role',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 600, fontSize: '12px', color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                id: 'contact',
                header: 'Contact Info',
                accessorFn: (row: any) => `${row.email} ${row.phoneNumber}`,
                Cell: ({ row }: any) => {
                    const member = row.original;
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                <Typography sx={{ fontWeight: 600, fontSize: '11px', color: 'text.secondary' }}>{member.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                <Typography sx={{ fontWeight: 600, fontSize: '11px', color: 'text.secondary' }}>{member.phoneNumber || 'N/A'}</Typography>
                            </Box>
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'enabled',
                header: 'Status',
                Cell: ({ cell }: any) => {
                    const enabled = cell.getValue() as boolean;
                    return (
                        <Typography
                            sx={{
                                fontWeight: 900,
                                color: enabled ? 'success.main' : 'text.disabled',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
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
        data: staffMembers,
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
            isLoading,
            columnVisibility: {
                id: !isMobile,
                contact: !isMobile,
            }
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
                Staff Management
            </Typography>

            <DashboardCard sx={{ mt: 1, p: 0, overflow: 'hidden' }}>
                <Box sx={{
                    p: '14px',
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}`
                }}>
                    <TableHeaderToolbar
                        table={table}
                        isSmall
                        ExcelData={{
                            data: staffMembers,
                            fileName: 'Staff_Export'
                        }}
                        actionButton={
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => navigate('add')}
                                sx={{
                                    borderRadius: '10px',
                                    bgcolor: theme.palette.primary.main,
                                    height: '32px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 2
                                }}
                            >
                                Add Staff
                            </Button>
                        }
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default Staff;
