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
    MoreVert as MoreIcon
} from '@mui/icons-material';
import { useMaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/features/user/context/useUser';
import { DashboardCard } from '@/features/dashboard';
import { TableComponent, TableBottomToolbar, TableHeaderToolbar } from '@/components/UI/Table';
import { StatusBadge } from '@/shared/ui/StatusBadge';

// Mock data for requests
const mockRequests = [
    { id: 'RQ-101', subject: 'Wedding Venue Inquiry', sender: 'Priya Sharma', category: 'Venue', date: '2024-12-20', status: 'Pending', type: 'Inquiry' },
    { id: 'RQ-102', subject: 'Photography Package', sender: 'Rahul Varma', category: 'Photography', date: '2024-12-21', status: 'In Discussion', type: 'Inquiry' },
    { id: 'RQ-103', subject: 'Custom Floral Decor', sender: 'Anita Roy', category: 'Decoration', date: '2024-12-22', status: 'Accepted', type: 'Booking' },
    { id: 'RQ-104', subject: 'Catering for 200 Guests', sender: 'Suresh Raina', category: 'Catering', date: '2024-12-23', status: 'Pending', type: 'Inquiry' },
    { id: 'RQ-105', subject: 'DJ & Sound Setup', sender: 'Vikram Singh', category: 'Music', date: '2024-12-24', status: 'Rejected', type: 'Booking' },
];

const RequestsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useUser();
    const role = user?.role;

    const currentRole = role?.toLowerCase() || 'client';

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Request ID',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600 }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'subject',
                header: 'Subject',
                Cell: ({ row }: any) => {
                    const request = row.original;
                    return (
                        <Box>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>{request.subject}</Typography>
                        </Box>
                    );
                }
            },
            {
                id: 'categoryOrSender',
                accessorFn: (row: any) => currentRole === 'client' ? row.category : row.sender,
                header: currentRole === 'client' ? 'Category' : 'Client Name',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary' }}>
                        {cell.getValue() as string}
                    </Typography>
                )
            },
            {
                accessorKey: 'date',
                header: 'Date',
                Cell: ({ cell }: any) => (
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>{cell.getValue() as string}</Typography>
                )
            },
            {
                accessorKey: 'type',
                header: 'Type',
                Cell: ({ cell }: any) => (
                    <Typography
                        sx={{
                            fontWeight: 900,
                            color: 'primary.main',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {cell.getValue() as string}
                    </Typography>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }: any) => (
                    <StatusBadge status={cell.getValue() as string} variant="request" />
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
        [currentRole]
    );

    const filteredRequests = useMemo(() => mockRequests, []);

    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);

    const table = useMaterialReactTable({
        muiTopToolbarProps: { sx: { p: '14px' } },
        columns,
        data: filteredRequests,
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
            columnVisibility: {
                id: !isMobile,
                date: !isMobile,
                type: !isMobile,
            }
        },
    });

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <DashboardCard sx={{ mt: 1, p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: '14px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: `1px solid ${theme.dashboard?.glassBorder || alpha(theme.palette.divider, 0.1)}` }}>
                    <TableHeaderToolbar
                        HeaderText='Request Management'
                        table={table}
                        isSmall
                        ExcelData={{
                            data: mockRequests,
                            fileName: 'Requests_Export'
                        }}
                        actionButton={
                            currentRole === 'client' && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => navigate('add')}
                                    sx={{
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 2
                                    }}
                                >
                                    New Request
                                </Button>
                            )
                        }
                    />
                </Box>

                <TableComponent table={table} />
                <TableBottomToolbar table={table} />
            </DashboardCard>
        </Box>
    );
};


export default RequestsPage;
