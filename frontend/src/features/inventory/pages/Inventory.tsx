import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    alpha,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Inventory as InventoryIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { INVENTORY_API } from '../api/inventory.api';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { getErrorMessage } from '@/lib/error';

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    stock: number;
    unit: string;
    status: string;
    lastUpdated: string;
}

const InventoryPage = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { success, error: showError } = useSnackbar();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState({ name: '', category: '', stock: 0, unit: 'pcs' });

    // Fetch Inventory
    const { data: inventory = [], isLoading } = useQuery<InventoryItem[]>({
        queryKey: ['inventory'],
        queryFn: async () => {
            const response = await INVENTORY_API.getAll();
            return response.data || [];
        }
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: INVENTORY_API.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            setIsCreateOpen(false);
            success('Item added to inventory');
            setFormData({ name: '', category: '', stock: 0, unit: 'pcs' });
        },
        onError: (err) => showError(getErrorMessage(err))
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, params }: { id: number; params: any }) => INVENTORY_API.update(id, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            setIsEditOpen(false);
            success('Inventory updated');
        },
        onError: (err) => showError(getErrorMessage(err))
    });

    const deleteMutation = useMutation({
        mutationFn: INVENTORY_API.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            success('Item removed from inventory');
        },
        onError: (err) => showError(getErrorMessage(err))
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Asset Name',
                Cell: ({ row }: any) => {
                    const item = row.original;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                                display: 'flex'
                            }}>
                                <InventoryIcon fontSize="small" />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.name}</Typography>
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'category',
                header: 'Category',
                Cell: ({ cell }: any) => (
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 800, color: 'text.disabled', bgcolor: alpha(theme.palette.divider, 0.3), px: 1, py: 0.25, borderRadius: 1 }}>
                        {cell.getValue() as string}
                    </Typography>
                )
            },
            {
                accessorKey: 'stock',
                header: 'Stock',
                Cell: ({ row }: any) => {
                    const item = row.original;
                    return (
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            {item.stock} <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.unit}</Typography>
                        </Typography>
                    );
                }
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => (
                    <StatusBadge status={(cell.getValue() as string).toLowerCase()} variant="inventory" />
                )
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 100,
                enableColumnFilter: false,
                enableSorting: false,
                Cell: ({ row }: any) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                            <IconButton 
                                size="small" 
                                onClick={() => {
                                    setSelectedItem(row.original);
                                    setFormData({ ...row.original });
                                    setIsEditOpen(true);
                                }}
                                sx={{ color: 'primary.main' }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => {
                                    if (window.confirm('Delete this asset?')) {
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
        data: inventory,
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
                        Inventory Assets
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                        Track and manage your physical resources and equipment.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
                >
                    Add Asset
                </Button>
            </Box>

            <DashboardCard noPadding sx={{ overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <TableHeaderToolbar 
                        table={table} 
                        isSmall 
                        ExcelData={{ data: inventory, fileName: 'Inventory_Export' }}
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>

            {/* Create/Edit Dialog */}
            <Dialog open={isCreateOpen || isEditOpen} onClose={() => { setIsCreateOpen(false); setIsEditOpen(false); }}>
                <DialogTitle sx={{ fontWeight: 800 }}>{isCreateOpen ? 'Add New Asset' : 'Edit Asset'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField 
                            label="Asset Name" 
                            fullWidth 
                            size="small"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField 
                            label="Category" 
                            fullWidth 
                            size="small"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Stock" 
                                type="number" 
                                size="small"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                            />
                            <TextField 
                                label="Unit" 
                                size="small"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        sx={{ fontWeight: 700, borderRadius: '8px' }}
                        onClick={() => {
                            if (isCreateOpen) createMutation.mutate(formData);
                            else if (selectedItem) updateMutation.mutate({ id: selectedItem.id, params: formData });
                        }}
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {isCreateOpen ? 'Create' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InventoryPage;
