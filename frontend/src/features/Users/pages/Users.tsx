import { useMemo, useState } from 'react';
import { Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import { useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';


import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { USER_SERVICE } from '../api/user.api';
import { useQuery } from '@tanstack/react-query';
import { EyeIcon, PlusIcon } from 'lucide-react';
import { useUser } from '../../user/context/useUser';
import type { User } from '@/features/auth';

const UsersPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useUser();

    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await USER_SERVICE.getAllUsers();
            if (!response.ok) throw new Error("Failed to fetch users");
            const rawData: User[] = response?.data || [];
            return rawData.filter((u) => u.email !== user?.email);
        }
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.primary', textAlign: 'start' }}>{cell.getValue() as string}</Typography>
            },
            {
                accessorKey: 'email',
                header: 'Email',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'start' }}>{cell.getValue() as string}</Typography>
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone Number',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'start' }}>{cell.getValue() as string}</Typography>
            },
            {
                accessorKey: 'address',
                header: 'Address',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'start' }}>{cell.getValue() as string}</Typography>
            },
            {
                accessorKey: 'createdAt',
                header: 'Joined Date',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary', textAlign: 'start' }}>{new Date(cell.getValue() as string).toLocaleDateString()}</Typography>
            },
            {
                accessorKey: 'role',
                header: 'Role',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.primary', textAlign: 'start' }}>{cell.getValue() as string}</Typography>
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 80,
                enableColumnFilter: false,
                enableSorting: false,
                Cell: ({ row }: any) => (
                    <IconButton
                        onClick={() => navigate(`${row.original.id}`)}
                        sx={{ color: theme.palette.primary.main }}
                    >
                        <EyeIcon size={18} />
                    </IconButton>
                )
            }
        ],
        [theme]
    );

    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);

    const table = useMaterialReactTable({
        columns,
        data: users,
        state: {
            globalFilter,
            showGlobalFilter,
            isLoading
        },
        onGlobalFilterChange: setGlobalFilter,
        onShowGlobalFilterChange: setShowGlobalFilter,
        enableRowSelection: true,
        initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
        muiTablePaperProps: { elevation: 1, sx: { borderRadius: 0 } },
    });

    return (
        <Box sx={{ p: 0, maxWidth: 1600, m: 0 }}>
            <DashboardCard sx={{ m: 0, p: 0, overflow: 'hidden' }}>
                <Box sx={{
                    p: '14px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}`
                }}>
                    <TableHeaderToolbar
                        HeaderText="User Management"
                        table={table}
                        isSmall
                        ExcelData={{ data: users, fileName: 'Users_Export' }}
                        actionButton={
                            <IconButton
                                size="small"
                                onClick={() => navigate('add')}
                                sx={{
                                    borderRadius: "50%",
                                }}
                            >
                                <PlusIcon color={theme.palette.primary.main} size={20} />
                            </IconButton>
                        }
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default UsersPage;
