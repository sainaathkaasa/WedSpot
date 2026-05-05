import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Stack,
    IconButton,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Skeleton,
    useTheme,
    alpha,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useUser } from '@/features/user';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { DashboardCard } from '@/features/dashboard';
import { useBookingDetails, useUpdateBookingStatus, useCancelBooking } from '../hooks';
import type { BookingStatus } from '../types/bookings.types';
import { StatusBadge } from '@/shared/ui';
import { getErrorMessage } from '@/lib/error';

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getPaymentStatus(total: number, advance: number): string {
    if (advance <= 0) return 'UNPAID';
    if (advance >= total) return 'PAID';
    return 'PARTIAL';
}

const BookingDetailsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUser();
    const { error, success } = useSnackbar();
    const bookingId = Number(id);
    const currentRole = user?.role?.toLowerCase();

    const { data: booking, isLoading, isError } = useBookingDetails(bookingId);
    const updateStatus = useUpdateBookingStatus();
    const cancelBooking = useCancelBooking();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);


    console.log("Booking:", booking);

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="text" width={200} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Container>
        );
    }

    if (isError || !booking) {
        return (
            <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="error">Unable to load booking details</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>The booking may have been deleted or you do not have access.</Typography>
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ mt: 3 }}>
                    Go Back
                </Button>
            </Container>
        );
    }

    const paymentStatus = getPaymentStatus(booking.totalAmount, booking.advancePaid);
    const balance = booking.totalAmount - booking.advancePaid;


    const handleStatusUpdate = (status: BookingStatus) => {
        updateStatus.mutate(
            { id: bookingId, status },
            {
                onSuccess: (response) => {
                    success(`Booking marked as ${status.toLowerCase()}`)
                    console.log("Booking marked: ", response)
                },
                onError: (err) => error(getErrorMessage(err)),
            }
        );
    };

    const handleCancel = () => {
        cancelBooking.mutate(bookingId, {
            onSuccess: () => {
                success('Booking cancelled successfully');
                setCancelDialogOpen(false);
            },
            onError: (err) => error(getErrorMessage(err)),
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconButton onClick={() => navigate(-1)} size="small">
                    <BackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight={800}>
                        Booking #{booking.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                    </Typography>
                </Box>
                <StatusBadge status={booking.status} variant="booking" />
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Event Details */}
                <Grid item xs={12} md={4}>
                    <DashboardCard sx={{ p: 3, height: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Event Details
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CalendarIcon fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Event Date</Typography>
                                    <Typography variant="body1" fontWeight={600}>{formatDate(booking.eventDate)}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <LocationIcon fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Location</Typography>
                                    <Typography variant="body1" fontWeight={600}>{booking.eventLocation || 'N/A'}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PeopleIcon fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Guests</Typography>
                                    <Typography variant="body1" fontWeight={600}>{booking.guestCount}</Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </DashboardCard>
                </Grid>

                {/* Payment */}
                <Grid item xs={12} md={4}>
                    <DashboardCard sx={{ p: 3, height: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Payment
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <MoneyIcon fontSize="small" color="primary" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                                    <Typography variant="h6" fontWeight={700}>{formatCurrency(booking.totalAmount)}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">Advance Paid</Typography>
                                <Typography variant="body1" fontWeight={600} color="success.main">{formatCurrency(booking.advancePaid)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">Balance Due</Typography>
                                <Typography variant="body1" fontWeight={600} color={balance > 0 ? 'error.main' : 'text.primary'}>
                                    {formatCurrency(balance)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                                <StatusBadge status={paymentStatus} variant="payment" />
                            </Box>
                        </Stack>
                    </DashboardCard>
                </Grid>

                {/* Client Info */}
                <Grid item xs={12} md={4}>
                    <DashboardCard sx={{ p: 3, height: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Client
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                    {booking.client?.name?.charAt(0) || '?'}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight={600}>{booking.client?.name || 'N/A'}</Typography>
                                </Box>
                            </Box>
                            {booking.client?.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <EmailIcon fontSize="small" color="action" />
                                    <Typography variant="body2">{booking.client.email}</Typography>
                                </Box>
                            )}
                            {booking.client?.phoneNumber && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <PhoneIcon fontSize="small" color="action" />
                                    <Typography variant="body2">{booking.client.phoneNumber}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </DashboardCard>
                </Grid>
            </Grid>

            {/* Services Booked */}
            <DashboardCard sx={{ p: 0, overflow: 'hidden', mb: 4 }}>
                <Box sx={{ p: 2.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="h6" fontWeight={700}>
                        Services Booked
                    </Typography>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="body2" fontWeight={700} color="text.secondary">Service</Typography></TableCell>
                                <TableCell><Typography variant="body2" fontWeight={700} color="text.secondary">Category</Typography></TableCell>
                                <TableCell><Typography variant="body2" fontWeight={700} color="text.secondary">Vendor</Typography></TableCell>
                                <TableCell align="right"><Typography variant="body2" fontWeight={700} color="text.secondary">Price</Typography></TableCell>
                                <TableCell align="right"><Typography variant="body2" fontWeight={700} color="text.secondary">Qty</Typography></TableCell>
                                <TableCell align="right"><Typography variant="body2" fontWeight={700} color="text.secondary">Total</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {booking.services?.map((service) => (
                                <TableRow key={service.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {service.imageUrl && (
                                                <Avatar
                                                    variant="rounded"
                                                    src={service.imageUrl}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            )}
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>{service.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {service.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={service.category} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{service.vendor?.name || 'N/A'}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={600}>{formatCurrency(service.price)}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2">{service.quantity || 1}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={700}>
                                            {formatCurrency(service.price * (service.quantity || 1))}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={5} align="right">
                                    <Typography variant="body1" fontWeight={700}>Grand Total</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" fontWeight={800} color="primary.main">
                                        {formatCurrency(booking.totalAmount)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DashboardCard>

            {/* Notes */}
            {booking.notes && (
                <DashboardCard sx={{ p: 3, mb: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Notes
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {booking.notes}
                    </Typography>
                </DashboardCard>
            )}

            {/* Action Buttons (role-based) */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {currentRole === 'vendor' && booking.status === 'PENDING' && (
                    <>
                        <Button variant="outlined" onClick={() => handleStatusUpdate('CANCELLED')} color="error">
                            Reject
                        </Button>
                        <Button variant="contained" onClick={() => handleStatusUpdate('CONFIRMED')} disabled={updateStatus.isPending}>
                            {updateStatus.isPending ? 'Confirming...' : 'Confirm Booking'}
                        </Button>
                    </>
                )}
                {currentRole === 'vendor' && booking.status === 'CONFIRMED' && (
                    <Button variant="contained" onClick={() => handleStatusUpdate('COMPLETED')} disabled={updateStatus.isPending}>
                        {updateStatus.isPending ? 'Completing...' : 'Mark Complete'}
                    </Button>
                )}
                {currentRole === 'client' && booking.status === 'PENDING' && (
                    <Button variant="outlined" color="error" onClick={() => setCancelDialogOpen(true)}>
                        Cancel Booking
                    </Button>
                )}
                {currentRole === 'admin' && (
                    <>
                        {booking.status === 'PENDING' && (
                            <Button variant="contained" onClick={() => handleStatusUpdate('CONFIRMED')} disabled={updateStatus.isPending}>
                                Confirm
                            </Button>
                        )}
                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                            <Button variant="outlined" color="error" onClick={() => handleStatusUpdate('CANCELLED')} disabled={updateStatus.isPending}>
                                Cancel
                            </Button>
                        )}
                        {booking.status === 'CONFIRMED' && (
                            <Button variant="contained" onClick={() => handleStatusUpdate('COMPLETED')} disabled={updateStatus.isPending}>
                                Mark Complete
                            </Button>
                        )}
                    </>
                )}
            </Box>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel booking #{booking.id}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Go Back</Button>
                    <Button onClick={handleCancel} color="error" disabled={cancelBooking.isPending} variant="contained">
                        {cancelBooking.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookingDetailsPage;
