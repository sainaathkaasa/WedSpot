import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    alpha,
    useTheme
} from '@mui/material';
import {
    Close as CloseIcon,
    RestaurantMenu as FoodIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';
import type { CartItem } from '@/entities/cart';

interface CateringDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (quantity: number) => void;
    service: CartItem;
}

const CateringDialog: React.FC<CateringDialogProps> = ({ open, onClose, onAdd, service }) => {
    const theme = useTheme();
    const [quantity, setQuantity] = useState<number>(100);
    const [error, setError] = useState<string>('');

    const handleIncrement = () => {
        if (quantity < 1000) {
            setQuantity(prev => prev + 10);
            setError('');
        }
    };

    const handleDecrement = () => {
        if (quantity > 10) {
            setQuantity(prev => prev - 10);
            setError('');
        } else if (quantity > 1) {
            setQuantity(prev => prev - 1);
            setError('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (isNaN(val)) {
            setQuantity(0);
            return;
        }
        if (val < 1) {
            setError('Min: 1 plate');
        } else if (val > 1000) {
            setError('Max: 1000 plates');
        } else {
            setError('');
        }
        setQuantity(val);
    };

    const handleSubmit = () => {
        if (quantity < 1 || quantity > 1000) {
            setError('Please enter a valid number (1-1000)');
            return;
        }
        onAdd(quantity);
        onClose();
        setQuantity(100); // Reset for next time
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    width: '100%',
                    maxWidth: 400,
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: '12px',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: 'secondary.main',
                        display: 'flex'
                    }}>
                        <FoodIcon fontSize="small" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Reserve Catering</Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: 'text.disabled' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontWeight: 500 }}>
                    Specify the number of plates for <strong>{service.name}</strong>. You can adjust this later in your cart.
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 2
                }}>
                    <IconButton
                        onClick={handleDecrement}
                        sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '12px',
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.05), color: 'error.main' }
                        }}
                    >
                        <RemoveIcon />
                    </IconButton>

                    <TextField
                        value={quantity}
                        onChange={handleChange}
                        type="number"
                        error={!!error}
                        helperText={error}
                        inputProps={{ min: 1, max: 1000, style: { textAlign: 'center', fontWeight: 900, fontSize: '1.5rem' } }}
                        sx={{
                            width: 140,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                            },
                            '& .MuiFormHelperText-root': {
                                textAlign: 'center',
                                fontWeight: 600
                            }
                        }}
                    />

                    <IconButton
                        onClick={handleIncrement}
                        sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '12px',
                            '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main' }
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.disabled', fontWeight: 600 }}>
                    MIN: 1 | MAX: 1000 PLATES
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    sx={{
                        borderRadius: '14px',
                        py: 1.5,
                        fontWeight: 800,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: `0 8px 20px ${alpha(theme.palette.secondary.main, 0.2)}`
                    }}
                >
                    Confirm & Add to Cart
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CateringDialog;
