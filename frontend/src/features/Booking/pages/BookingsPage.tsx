import { useCallback, useMemo, useState } from 'react';
import {
    alpha,
    Box,
    Button,
    IconButton,
    MenuItem,
    Select,
    Typography,
    useMediaQuery,
    useTheme,
    Tooltip,
    Menu,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    List as ListIcon,
    MoreVert as MoreVertIcon,
    RemoveRedEye as ViewIcon,
    Cancel as CancelIcon,
    EventNote as EventNoteIcon,
    CheckCircle as CheckCircleIcon,
    FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/features/dashboard';
import { TableBottomToolbar, TableComponent, TableHeaderToolbar } from '@/components/UI/Table';
import { PremiumCalendar } from '@/components/UI/Calendar';
import { useUser } from '@/features/user';
import { BOOKING_SERVICE } from '../api';
import type { Booking, BookingStatus } from '../types/bookings.types';
import { StatusBadge, EmptyState } from '@/shared/ui';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { getErrorMessage } from '@/lib/error';

type ViewMode = 'list' | 'calendar';
type BookingRole = 'client' | 'vendor' | 'admin' | 'manager' | 'staff' | string;

interface CalendarBooking {
    id: string;
    title: string;
    client: string;
    vendor: string;
    date: string;
    amount: string;
    status: string;
}

const BOOKING_QUERY_KEY = 'bookings';

const getBookingQueryKey = (role: BookingRole, userId?: number) => [BOOKING_QUERY_KEY, role, userId] as const;

const formatCurrency = (amount?: number): string => {
    return `\u20B9${(amount ?? 0).toLocaleString('en-IN')}`;
};

const formatDisplayDate = (date?: string): string => {
    if (!date) return 'N/A';
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleDateString();
};

const formatCalendarDate = (date?: string): string => {
    if (!date) return '';
    return date.includes('T') ? date.split('T')[0] : date;
};

const getServiceNames = (booking: Booking): string => {
    return booking.services?.map((service) => service.name).filter(Boolean).join(', ') || 'N/A';
};

const getVendorName = (booking: Booking): string => {
    return booking.services?.[0]?.vendor?.name ?? 'N/A';
};

const getBookingsByRole = (role: BookingRole, userId?: number) => {
    switch (role.toUpperCase()) {
        case 'CLIENT':
            return BOOKING_SERVICE.getClientBooking(Number(userId));
        case 'VENDOR':
            return BOOKING_SERVICE.getVendorBooking(Number(userId));
        default:
            return BOOKING_SERVICE.getAllBooking();
    }
};

const statusOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' },
];

const BookingsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useUser();
    const { error, success } = useSnackbar();
    const currentRole = (user?.role?.toLowerCase() || 'client') as BookingRole;
    const userId = user?.id ? Number(user.id) : undefined;
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [globalFilter, setGlobalFilter] = useState('');
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [actionMenu, setActionMenu] = useState<{ el: HTMLElement; booking: Booking } | null>(null);

    const canFetchBookings = currentRole !== 'client' && currentRole !== 'vendor' || userId !== undefined;

    const { data: bookingResponse, isLoading, isError } = useQuery({
        queryKey: getBookingQueryKey(currentRole, userId),
        queryFn: () => getBookingsByRole(currentRole, userId),
        enabled: canFetchBookings,
    });

    const bookings = useMemo(() => bookingResponse?.data ?? [], [bookingResponse?.data]);

    const filteredBookings = useMemo(() => {
        if (statusFilter === 'all') return bookings;
        return bookings.filter((b: Booking) => b.status?.toUpperCase() === statusFilter);
    }, [bookings, statusFilter]);

    const calendarBookings = useMemo<CalendarBooking[]>(() => (
        filteredBookings.map((booking: Booking) => ({
            id: String(booking.id),
            title: getServiceNames(booking),
            client: booking.client?.name ?? 'N/A',
            vendor: getVendorName(booking),
            date: formatCalendarDate(booking.eventDate),
            amount: formatCurrency(booking.totalAmount),
            status: booking.status,
        }))
    ), [filteredBookings]);

    const handleDateClick = useCallback(() => {
        if (currentRole === 'client') {
            navigate('/client/vendors');
        }
    }, [currentRole, navigate]);

    const handleViewDetails = (booking: Booking) => {
        navigate(`/${currentRole}/bookings/${booking.id}`);
    };

    const handleActionClick = (event: React.MouseEvent<HTMLElement>, booking: Booking) => {
        setActionMenu({ el: event.currentTarget, booking });
    };

    const handleActionClose = () => setActionMenu(null);

    const columns = useMemo<MRT_ColumnDef<Booking>[]>(() => [
        {
            accessorKey: 'id',
            header: 'Booking ID',
            Cell: ({ cell }) => (
                <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>
                    #{cell.getValue<number>()}
                </Typography>
            ),
        },
        {
            accessorKey: 'client.name',
            header: 'Client',
            Cell: ({ cell }) => (
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.primary' }}>
                    {cell.getValue<string>() ?? 'N/A'}
                </Typography>
            ),
        },
        {
            id: 'services',
            header: 'Services',
            accessorFn: getServiceNames,
            Cell: ({ cell }) => (
                <Tooltip title={cell.getValue<string>()}>
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cell.getValue<string>()}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            accessorKey: 'eventDate',
            header: 'Event Date',
            Cell: ({ cell }) => (
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>
                    {formatDisplayDate(cell.getValue<string>())}
                </Typography>
            ),
        },
        {
            accessorKey: 'eventLocation',
            header: 'Location',
            Cell: ({ cell }) => (
                <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 500 }}>
                    {cell.getValue<string>() || 'N/A'}
                </Typography>
            ),
        },
        {
            accessorKey: 'totalAmount',
            header: 'Amount',
            Cell: ({ cell }) => (
                <Typography sx={{ fontWeight: 800, fontSize: '13px', color: 'text.primary' }}>
                    {formatCurrency(cell.getValue<number>())}
                </Typography>
            ),
        },
        {
            accessorKey: 'advancePaid',
            header: 'Advance Paid',
            Cell: ({ cell }) => {
                const val = cell.getValue<number>();
                return (
                    <Typography sx={{ fontWeight: 600, fontSize: '12px', color: val > 0 ? 'success.main' : 'text.disabled' }}>
                        {val > 0 ? formatCurrency(val) : '—'}
                    </Typography>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ cell }) => (
                <StatusBadge status={cell.getValue<BookingStatus>()} variant="booking" />
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            muiTableHeadCellProps: { align: 'center' },
            muiTableBodyCellProps: { align: 'center' },
            enableColumnFilter: false,
            enableSorting: false,
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton size="small" onClick={(e) => handleActionClick(e, row.original)}>
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ], []);

    const table = useMaterialReactTable({
        muiTopToolbarProps: { sx: { p: '14px' } },
        columns,
        data: filteredBookings,
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
                borderRadius: 0,
                border: 'none',
            },
        },
        state: {
            globalFilter,
            showGlobalFilter,
            isLoading,
            columnVisibility: {
                id: !isMobile,
                eventLocation: !isMobile,
                advancePaid: !isMobile,
            },
        },
    });

    if (isError) {
        return (
            <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
                <Typography variant="h6" color="error" sx={{ textAlign: 'center', py: 10 }}>
                    Failed to load bookings. Please try again later.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                        Bookings Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                        Track booking status, schedules, clients, and service value.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Button
                        startIcon={<ListIcon />}
                        variant={viewMode === 'list' ? 'contained' : 'outlined'}
                        onClick={() => setViewMode('list')}
                        size="small"
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                    >
                        List View
                    </Button>
                    <Button
                        startIcon={<CalendarIcon />}
                        variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                        onClick={() => setViewMode('calendar')}
                        size="small"
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Calendar
                    </Button>
                </Box>
            </Box>

            {viewMode === 'list' ? (
                <DashboardCard sx={{ p: 0, overflow: 'hidden' }}>
                    <Box sx={{ p: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`, flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilterListIcon fontSize="small" color="action" />
                            <Select
                                size="small"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{ minWidth: 140, height: 32 }}
                                displayEmpty
                            >
                                {statusOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.8rem' }}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <TableHeaderToolbar
                            table={table}
                            isSmall
                            ExcelData={{
                                data: filteredBookings,
                                fileName: 'Bookings_Report',
                            }}
                        />
                    </Box>

                    {filteredBookings.length === 0 && !isLoading ? (
                        <EmptyState
                            title="No bookings found"
                            description={statusFilter !== 'all' ? 'Try changing the status filter.' : 'Bookings will appear here once they are created.'}
                            icon={<EventNoteIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />}
                        />
                    ) : (
                        <>
                            <TableComponent table={table} />
                            <TableBottomToolbar table={table} />
                        </>
                    )}
                </DashboardCard>
            ) : (
                <PremiumCalendar
                    bookings={calendarBookings}
                    onDateClick={handleDateClick}
                />
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenu?.el}
                open={!!actionMenu}
                onClose={handleActionClose}
                PaperProps={{ sx: { minWidth: 160 } }}
            >
                {actionMenu && (
                    <>
                        <MenuItem onClick={() => { handleViewDetails(actionMenu.booking); handleActionClose(); }}>
                            <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                            View Details
                        </MenuItem>
                        {currentRole === 'client' && actionMenu.booking.status === 'PENDING' && (
                            <MenuItem
                                onClick={() => {
                                    BOOKING_SERVICE.cancel(actionMenu.booking.id)
                                        .then(() => success('Booking cancelled'))
                                        .catch((err) => error(getErrorMessage(err)));
                                    handleActionClose();
                                }}
                                sx={{ color: 'error.main' }}
                            >
                                <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                                Cancel Booking
                            </MenuItem>
                        )}
                        {currentRole === 'vendor' && actionMenu.booking.status === 'PENDING' && (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        BOOKING_SERVICE.updateStatus(actionMenu.booking.id, 'CONFIRMED')
                                            .then(() => success('Booking confirmed'))
                                            .catch((err) => error(getErrorMessage(err)));
                                        handleActionClose();
                                    }}
                                    sx={{ color: 'success.main' }}
                                >
                                    <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                    Confirm
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        BOOKING_SERVICE.updateStatus(actionMenu.booking.id, 'CANCELLED')
                                            .then(() => success('Booking rejected'))
                                            .catch((err) => error(getErrorMessage(err)));
                                        handleActionClose();
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                                    Reject
                                </MenuItem>
                            </>
                        )}
                        {currentRole === 'vendor' && actionMenu.booking.status === 'CONFIRMED' && (
                            <MenuItem
                                onClick={() => {
                                    BOOKING_SERVICE.updateStatus(actionMenu.booking.id, 'COMPLETED')
                                        .then(() => success('Booking marked complete'))
                                        .catch((err) => error(getErrorMessage(err)));
                                    handleActionClose();
                                }}
                            >
                                <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                Mark Complete
                            </MenuItem>
                        )}
                    </>
                )}
            </Menu>
        </Box>
    );
};

export default BookingsPage;
