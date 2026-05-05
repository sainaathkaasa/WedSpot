import React, { useRef } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    alpha,
    useTheme,
    Stack
} from '@mui/material';
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
    const cardRef = useRef<HTMLDivElement>(null);
    const { isItemInCart } = useCart();

    const isCatering = (service.category || '').toLowerCase() === 'catering';
    const isInCart = isItemInCart(String(service.id));

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cardRef.current?.style.setProperty("--x", `${x}px`);
            cardRef.current?.style.setProperty("--y", `${y}px`);
        }
    };

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
        <>
            <Card
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onClick={handleNavigate}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    bgcolor: 'background.paper',
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.03)}`,
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    '&:hover': {
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        '& .vendor-image': {
                            transform: 'scale(1.1)',
                        },
                        '& .card-shine': {
                            opacity: 1,
                        }
                    }
                }}
            >
                {/* Image Section */}
                <Box sx={{ position: 'relative', pt: '65%' }}>
                    <CardMedia
                        component="img"
                        image={service.imageUrl}
                        alt={service.name}
                        loading="lazy"
                        className="vendor-image"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                            willChange: 'transform',
                        }}
                    />

                    {/* Price Overlay */}
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        px: 1.5,
                        py: 1,
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 1
                    }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
                            Starting At
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 900, fontSize: '0.9rem' }}>
                            {service.price}
                        </Typography>
                    </Box>

                    {/* Sector Badge */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        bgcolor: alpha(isCatering ? theme.palette.secondary.main : theme.palette.primary.main, 0.9),
                        backdropFilter: 'blur(4px)',
                        px: 1.2,
                        py: 0.6,
                        borderRadius: '10px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.7,
                        boxShadow: 2,
                        zIndex: 1
                    }}>
                        {isCatering ? <FoodIcon sx={{ fontSize: 14 }} /> : <CartIcon sx={{ fontSize: 14 }} />}
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                            {service.category}
                        </Typography>
                    </Box>

                    {/* Rating Badge */}
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        zIndex: 1
                    }}>
                        <StarsIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>{service.rating}</Typography>
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary', lineHeight: 1.2 }}>
                            {service.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                {service.location}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Services Section */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {service.tags.slice(0, 3).map((tag, idx) => (
                                <Chip
                                    key={idx}
                                    label={tag}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        color: 'primary.main',
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={{
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                        pt: 2,
                        mt: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1
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
                                    fontSize: '0.8rem',
                                    borderRadius: '10px'
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
                            startIcon={(isInCart && !isCatering) ? <CheckIcon /> : (isCatering ? <FoodIcon sx={{ fontSize: 16 }} /> : <CartIcon sx={{ fontSize: 16 }} />)}
                            sx={{
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 800,
                                px: 2,
                                height: 36,
                                flexShrink: 0,
                                boxShadow: (isInCart && !isCatering) ? 'none' : `0 4px 12px ${alpha(isCatering ? theme.palette.secondary.main : theme.palette.primary.main, 0.2)}`,
                            }}
                        >
                            {isCatering ? 'Reserve' : (isInCart ? 'View' : 'Book Now')}
                        </Button>
                    </Box>
                </CardContent>

                {/* Premium Shine Overlay */}
                <Box
                    className="card-shine"
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        background: `radial-gradient(600px circle at var(--x) var(--y), ${alpha(theme.palette.primary.main, 0.1)}, transparent 40%)`,
                        opacity: 0,
                        transition: 'opacity 0.6s ease',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
            </Card>

        </>
    );
};

export default VendorCard;
