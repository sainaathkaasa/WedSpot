import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    alpha,
    useTheme
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
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

    const { data: staffMembers = [], isLoading } = useQuery({
        queryKey: ['staff'],
        queryFn: () => USER_SERVICE.getAllUsers(),
        select: (response) =>
            response.data?.filter(user => String(user.role).toUpperCase() === 'STAFF') ?? []
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Member Name',
                Cell: ({ row }: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '11px'
                        }}>
                            {row.original.name.charAt(0)}
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>{row.original.name}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>{row.original.email}</Typography>
                        </Box>
                    </Box>
                )
            },
            {
                accessorKey: 'role',
                header: 'Department / Role',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, fontSize: '11px', color: 'text.secondary', textTransform: 'uppercase' }}>
                        {cell.getValue() as string}
                    </Typography>
                )
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone Number',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 600, fontSize: '12px', color: 'text.primary' }}>{cell.getValue() as string || '—'}</Typography>
                )
            },
            {
                accessorKey: 'enabled',
                header: 'Status',
                Cell: ({ cell }: any) => {
                    const enabled = cell.getValue() as boolean;
                    return (
                        <Box sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: '4px', 
                            bgcolor: alpha(enabled ? theme.palette.success.main : theme.palette.text.disabled, 0.1),
                            color: enabled ? theme.palette.success.main : theme.palette.text.disabled,
                            fontSize: '10px',
                            fontWeight: 900,
                            display: 'inline-block',
                            textTransform: 'uppercase'
                        }}>
                            {enabled ? 'Active' : 'Inactive'}
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 80,
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
        columns,
        data: staffMembers,
        state: { globalFilter, showGlobalFilter, isLoading },
        onGlobalFilterChange: setGlobalFilter,
        onShowGlobalFilterChange: setShowGlobalFilter,
        enableRowSelection: true,
        muiTablePaperProps: { elevation: 0 },
    });

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Operations Team
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                        Manage internal staff roles, permissions, and accessibility.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('add')}
                    sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
                >
                    Add Member
                </Button>
            </Box>

            <DashboardCard noPadding sx={{ overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TableHeaderToolbar 
                        table={table} 
                        isSmall 
                        ExcelData={{ data: staffMembers, fileName: 'Staff_Export' }}
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};


export default Staff;
