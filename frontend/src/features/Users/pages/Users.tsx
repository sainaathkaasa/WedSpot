import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
    Stack
} from '@mui/material';
import { useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { USER_SERVICE } from '../api/user.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EyeIcon, PlusIcon, Trash2 as DeleteIcon } from 'lucide-react';
import { useUser } from '../../user/context/useUser';
import type { User } from '@/features/auth';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { getErrorMessage } from '@/lib/error';

const UsersPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user: currentUser } = useUser();
    const { success, error: showError } = useSnackbar();

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await USER_SERVICE.getAllUsers();
            if (!response.ok) throw new Error("Failed to fetch users");
            const rawData: User[] = response?.data || [];
            return rawData.filter((u) => u.email !== currentUser?.email);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => USER_SERVICE.deleteUserById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            success("User deleted successfully");
            setDeleteId(null);
        },
        onError: (err) => showError(getErrorMessage(err))
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{cell.getValue()}</Typography>

            },
            {
                accessorKey: 'email',
                header: 'Email',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}> {cell.getValue() as string}</Typography>

            },
            {
                accessorKey: 'role',
                header: 'Role',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{(cell.getValue() as string || '').toUpperCase()}</Typography>

            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
            },
            {
                accessorKey: 'createdAt',
                header: 'Joined',
                Cell: ({ cell }: any) => <Typography sx={{ fontSize: 11, color: 'text.disabled', fontWeight: 600 }}>{new Date(cell.getValue() as string).toLocaleDateString()}</Typography>
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 100,
                enableColumnFilter: false,
                enableSorting: false,
                Cell: ({ row }: any) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details">
                            <IconButton
                                size="small"
                                onClick={() => navigate(`${row.original.id}`)}
                                sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
                            >
                                <EyeIcon size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                            <IconButton
                                size="small"
                                onClick={() => setDeleteId(row.original.id)}
                                sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}
                            >
                                <DeleteIcon size={16} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )
            }
        ],
        [theme, navigate]
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
        muiTablePaperProps: { elevation: 0, sx: { borderRadius: 0 } },
        muiTableHeadCellProps: { sx: { bgcolor: alpha(theme.palette.background.default, 0.5) } },
    });

    return (
        <Box sx={{ p: 0, maxWidth: 1600 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    User Management
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                    Manage platform access and user roles efficiently.
                </Typography>
            </Box>

            <DashboardCard noPadding sx={{ overflow: 'hidden' }}>
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                    <TableHeaderToolbar
                        table={table}
                        isSmall
                        ExcelData={{ data: users, fileName: 'Users_Export' }}
                        actionButton={
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlusIcon size={16} />}
                                onClick={() => navigate('add')}
                                sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
                            >
                                Add User
                            </Button>
                        }
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setDeleteId(null)} sx={{ fontWeight: 700 }}>Cancel</Button>
                    <Button
                        onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isPending}
                        sx={{ fontWeight: 700, borderRadius: '8px' }}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete User"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersPage;
