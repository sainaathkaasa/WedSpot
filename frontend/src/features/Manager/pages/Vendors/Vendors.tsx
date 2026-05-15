import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    alpha,
    useTheme,
    Stack,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Storefront as StoreIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { USER_SERVICE } from '@/features/Users/api/user.api';
import type { User } from '@/features/auth';

const VendorsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Fetch Vendors from User Service
    const { data: vendors = [], isLoading } = useQuery<User[]>({
        queryKey: ['vendors-list'],
        queryFn: async () => {
            const response = await USER_SERVICE.getAllUsers();
            const allUsers: User[] = response.data || [];
            return allUsers.filter(user => String(user.role).toUpperCase() === 'VENDOR');
        }
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Vendor Name',
                Cell: ({ row }: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '11px'
                        }}>
                            <StoreIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>{row.original.name}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>{row.original.email}</Typography>
                        </Box>
                    </Box>
                )
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Contact',
                Cell: ({ cell }: any) => (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '12px', color: 'text.primary' }}>{cell.getValue() as string || 'N/A'}</Typography>
                    </Stack>
                )
            },
            {
                accessorKey: 'address',
                header: 'Location',
                Cell: ({ cell }: any) => (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '11px', color: 'text.secondary' }}>{cell.getValue() as string || 'N/A'}</Typography>
                    </Stack>
                )
            },
            {
                id: 'rating',
                header: 'Performance',
                Cell: () => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, color: 'warning.main', fontSize: '12px' }}>
                            4.5
                        </Typography>
                        <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                    </Box>
                )
            },
            {
                accessorKey: 'role',
                header: 'Status',
                Cell: () => (
                    <StatusBadge status="Active" variant="vendor" />
                )
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
        data: vendors,
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
                        Partner Network
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                        Manage and monitor your verified vendors and service providers.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('add')}
                    sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
                >
                    Register Vendor
                </Button>
            </Box>

            <DashboardCard noPadding sx={{ overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TableHeaderToolbar 
                        table={table} 
                        isSmall 
                        ExcelData={{ data: vendors, fileName: 'Vendors_Export' }}
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default VendorsPage;
