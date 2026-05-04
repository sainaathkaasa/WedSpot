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
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { StatusBadge } from '@/shared/ui/StatusBadge';

// Mock data for vendors
const mockVendors = [
    { id: 'V001', name: 'Royal Banquet Hall', category: 'Venue', contact: 'Manoj Kumar', rating: 4.8, status: 'Active', location: 'Mumbai' },
    { id: 'V002', name: 'Capture Moments', category: 'Photography', contact: 'Anita Roy', rating: 4.9, status: 'Active', location: 'Delhi' },
    { id: 'V003', name: 'Floral Dreams', category: 'Decoration', contact: 'Suresh Raina', rating: 4.5, status: 'On Hold', location: 'Bangalore' },
    { id: 'V004', name: 'Gourmet Treats', category: 'Catering', contact: 'Chef Rahul', rating: 4.7, status: 'Active', location: 'Pune' },
    { id: 'V005', name: 'Elite Sounds', category: 'Music/DJ', contact: 'DJ Sunny', rating: 4.6, status: 'Under Review', location: 'Mumbai' },
];

const VendorsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Vendor ID',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 700, fontSize: '12px', color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'name',
                header: 'Vendor Details',
                Cell: ({ row }: any) => {
                    const vendor = row.original;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>{vendor.name}</Typography>
                                <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>Owner: {vendor.contact}</Typography>
                            </Box>
                        </Box>
                    );
                }
            },
            {
                accessorKey: 'category',
                header: 'Category',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 600, fontSize: '12px', color: 'text.primary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'location',
                header: 'Location',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontWeight: 600, fontSize: '12px', color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'rating',
                header: 'Rating',
                Cell: ({ cell }: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, color: 'warning.main', fontSize: '13px' }}>
                            {cell.getValue() as string}
                        </Typography>
                        <Box component="span" sx={{ color: 'warning.main', fontWeight: 800, fontSize: '12px' }}>★</Box>
                    </Box>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => (
                    <StatusBadge status={cell.getValue() as string} variant="vendor" />
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
        data: mockVendors,
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
            <DashboardCard sx={{ mt: 1, p: 0, overflow: 'hidden' }}>
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
                        HeaderText="Vendor Management"
                        table={table} 
                        isSmall 
                        ExcelData={{
                            data: mockVendors,
                            fileName: 'Vendors_Export'
                        }}
                        actionButton={
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                                    Add Vendor
                                </Button>
                            </Box>
                        }
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};

export default VendorsPage;
