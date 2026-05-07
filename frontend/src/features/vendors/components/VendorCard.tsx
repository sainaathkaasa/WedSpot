import React from 'react';
import {
    CardMedia,
    Typography,
    Box,
    Button,
    alpha,
    useTheme,
} from '@mui/material';
import { DashboardCard } from '@/features/dashboard';
import {
    LocationOn as LocationIcon,
    Stars as StarsIcon,
    CheckCircle as CheckIcon,
    ShoppingCart as CartIcon,
    Restaurant as FoodIcon
} from '@mui/icons-material';
import type { VendorService } from '../types/vendor';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/cartContextValue';


interface VendorCardProps {
    service: VendorService;
    actions?: React.ReactNode;
}

const VendorCard: React.FC<VendorCardProps> = ({ service, actions }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isItemInCart } = useCart();

    const isCatering = (service.category || '').toLowerCase() === 'catering';
    const isInCart = isItemInCart(String(service.id));

    const handleNavigate = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('client')) {
            navigate(`/client/vendors/${service.id}`);
        } else {
            navigate(`/products/${service.id}`);
        }
    };

    const handleBooking = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleNavigate();
    };

    return (
        <DashboardCard
            noPadding
            onClick={handleNavigate}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
            }}
        >
            {/* Image Section */}
            <Box sx={{ position: 'relative', pt: '56.25%' }}>
                <CardMedia
                    component="img"
                    image={service.imageUrl}
                    alt={service.name}
                    loading="lazy"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* Category Badge */}
                <Box sx={{
                    position: 'absolute',
                    top: theme.spacing(1.5),
                    left: theme.spacing(1.5),
                    bgcolor: alpha(isCatering ? theme.palette.secondary.main : theme.palette.primary.main, 0.95),
                    px: 1,
                    py: 0.5,
                    borderRadius: theme.shape.borderRadius / 2,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    zIndex: 1
                }}>
                    {isCatering ? <FoodIcon sx={{ fontSize: 12 }} /> : <CartIcon sx={{ fontSize: 12 }} />}
                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.625rem' }}>
                        {service.category}
                    </Typography>
                </Box>

                {/* Rating Badge */}
                <Box sx={{
                    position: 'absolute',
                    top: theme.spacing(1.5),
                    right: theme.spacing(1.5),
                    bgcolor: 'background.paper',
                    px: 1,
                    py: 0.5,
                    borderRadius: theme.shape.borderRadius / 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    border: `1px solid ${theme.palette.divider}`,
                    zIndex: 1
                }}>
                    <StarsIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {service.rating}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.3, mb: 0.5 }}>
                        {service.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {service.location}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Starts at
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>
                        {service.price}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    mt: 'auto',
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {actions}
                        <Button
                            variant="text"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
                            }}
                        >
                            Details
                        </Button>
                    </Box>

                    <Button
                        variant={(isInCart && !isCatering) ? "outlined" : "contained"}
                        color={isCatering ? "secondary" : "primary"}
                        size="small"
                        onClick={handleBooking}
                        startIcon={(isInCart && !isCatering) ? <CheckIcon /> : (isCatering ? <FoodIcon sx={{ fontSize: 14 }} /> : <CartIcon sx={{ fontSize: 14 }} />)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: theme.shape.borderRadius,
                            px: 2,
                        }}
                    >
                        {isCatering ? 'Reserve' : (isInCart ? 'View' : 'Book Now')}
                    </Button>
                </Box>
            </Box>
        </DashboardCard>
    );
};

export default VendorCard;
