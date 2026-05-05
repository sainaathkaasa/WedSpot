import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Inventory as InventoryIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { StatusBadge } from '@/shared/ui/StatusBadge';

interface InventoryItem {
    id: string;
    name: string;
    category: 'decor' | 'catering' | 'technical' | 'safety';
    stock: number;
    unit: string;
    status: 'available' | 'low' | 'out';
    lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
    { id: '1', name: 'Premium Velvet Chair Covers', category: 'decor', stock: 450, unit: 'pcs', status: 'available', lastUpdated: '2024-03-20' },
    { id: '2', name: 'Industrial Smoke Machines', category: 'technical', stock: 12, unit: 'units', status: 'available', lastUpdated: '2024-03-19' },
    { id: '3', name: 'Silk Table Linens (Gold)', category: 'decor', stock: 15, unit: 'pcs', status: 'low', lastUpdated: '2024-03-21' },
    { id: '4', name: 'Emergency Power Backup', category: 'safety', stock: 5, unit: 'units', status: 'available', lastUpdated: '2024-03-15' },
    { id: '5', name: 'Organic Floral Centerpieces', category: 'decor', stock: 0, unit: 'pcs', status: 'out', lastUpdated: '2024-03-22' },
];

const InventoryPage = () => {
    const theme = useTheme();


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
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'category',
                header: 'Category',
                Cell: ({ cell }: any) => (
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.disabled' }}>
                        {cell.getValue() as string}
                    </Typography>
                )
            },
            {
                accessorKey: 'stock',
                header: 'Stock Level',
                Cell: ({ row }: any) => {
                    const item = row.original;
                    return (
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {item.stock} <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>{item.unit}</Typography>
                        </Typography>
                    );
                }
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => (
                    <StatusBadge status={cell.getValue() as string} variant="inventory" />
                )
            },
            {
                accessorKey: 'lastUpdated',
                header: 'Last Updated',
                Cell: ({ cell }: any) => (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
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
        data: mockInventory,
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
        state: {
            globalFilter,
            showGlobalFilter,
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
                Inventory Management
            </Typography>
            <DashboardCard sx={{ mt: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}` }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2 }}>
                            <FilterIcon />
                        </IconButton>
                        <IconButton sx={{ bgcolor: 'secondary.main', color: 'white', borderRadius: 2, '&:hover': { bgcolor: 'secondary.dark' } }}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TableHeaderToolbar 
                            table={table} 
                            isSmall 
                            ExcelData={{
                                data: mockInventory,
                                fileName: 'Inventory_Export'
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

export default InventoryPage;
