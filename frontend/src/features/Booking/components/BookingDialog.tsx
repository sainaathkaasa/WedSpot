import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    alpha,
    useTheme
} from '@mui/material';
import { CalendarToday, LocationOn, People, Note } from '@mui/icons-material';

interface BookingDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (details: BookingDetails) => void;
    loading?: boolean;
}

export interface BookingDetails {
    eventDate: string;
    eventLocation: string;
    guestCount: number;
    notes: string;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ open, onClose, onConfirm, loading }) => {
    const theme = useTheme();
    const [details, setDetails] = React.useState<BookingDetails>({
        eventDate: '',
        eventLocation: '',
        guestCount: 0,
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({
            ...prev,
            [name]: name === 'guestCount' ? parseInt(value) || 0 : value
        }));
    };

    const isFormValid = details.eventDate && details.eventLocation && details.guestCount > 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '24px', p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>
                Finalize Your Booking
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontWeight: 500 }}>
                    Please provide the details for your event to help the vendor prepare the best experience for you.
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Event Date"
                            type="date"
                            name="eventDate"
                            value={details.eventDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Guest Count"
                            type="number"
                            name="guestCount"
                            value={details.guestCount}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <People sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Event Location"
                            name="eventLocation"
                            placeholder="e.g. Grand Plaza Ballroom, Mumbai"
                            value={details.eventLocation}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <LocationOn sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Additional Notes"
                            name="notes"
                            multiline
                            rows={3}
                            placeholder="Any special requests or instructions..."
                            value={details.notes}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <Note sx={{ mr: 1, mt: 1, color: 'primary.main', fontSize: 20, alignSelf: 'flex-start' }} />
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    sx={{ borderRadius: '12px', fontWeight: 700, px: 3 }}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onConfirm(details)}
                    variant="contained"
                    disabled={!isFormValid || loading}
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 700,
                        px: 4,
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                    }}
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingDialog;
