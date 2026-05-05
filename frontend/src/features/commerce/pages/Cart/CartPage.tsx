import { useState } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/cartContextValue';
import CartList from '../../components/Cart/CartList';
import BookingDialog, { type BookingDetails } from '../../components/Cart/BookingDialog';
import { BOOKING_SERVICE } from '@/features/Booking/api/bookings.api';

const CartPage = () => {
    const navigate = useNavigate();
    const { success, error } = useSnackbar();
    const { items, removeFromCart, updateQuantity, clearCart } = useCart();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const subtotal = items.reduce((acc: number, item: any) => {
        return acc + (item.numericPrice * item.quantity);
    }, 0);

    const handleRemove = (id: string, _name: string) => {
        removeFromCart(id);
    };

    const handleItemClick = (vendorId: string) => {
        navigate(`/client/vendors/${vendorId}`);
    };

    const handleCheckout = () => {
        setIsDialogOpen(true);
    };

    const handleConfirmBooking = async (details: BookingDetails) => {
        setIsBooking(true);
        try {
            const bookingRequest = {
                ...details,
                serviceIds: items
                    .map(item => Number(item.id))
                    .filter(id => !isNaN(id) && id !== 0)
            };

            const response = await BOOKING_SERVICE.createBooking(bookingRequest);

            if (response.ok) {
                success('Booking request submitted successfully!');
                clearCart();
                navigate('/dashboard');
            } else {
                error(response.message || 'Failed to create booking');
            }
        } catch (err: any) {
            error(err.response?.data?.message || 'An error occurred during booking');
        } finally {
            setIsBooking(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <Box sx={{ pt: 0, pb: 4 }}>
            <CartList
                items={items.map((item: any) => ({
                    ...item,
                    name: item.vendor?.name || item.name,
                    serviceName: item.category || item.name,
                    description: item.description || '',
                    price: item.priceRange || item.price,
                    onClick: () => handleItemClick(item.vendor?.id || item.id),
                    onUpdateQuantity: (newQty: number) => updateQuantity(item.id, newQty),
                    onRemove: () => handleRemove(item.id, item.name)
                }))}
                subtotal={subtotal}
                total={subtotal}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
                onExplore={() => navigate('/client/vendors')}
            />

            <BookingDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmBooking}
                loading={isBooking}
            />
        </Box>
    );
};

export default CartPage;
