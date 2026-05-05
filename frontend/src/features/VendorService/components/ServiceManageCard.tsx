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
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Stars as StarsIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Restaurant as FoodIcon,
    ShoppingCart as CartIcon
} from '@mui/icons-material';
import type { VendorService } from '@/entities/vendor-service';
import { formatCurrency } from '../utils/CurrencyFormatter';

interface ServiceManageCardProps {
    service: VendorService;
    onEdit: (service: VendorService) => void;
    onDelete: (serviceId: number) => void;
}

const ServiceManageCard: React.FC<ServiceManageCardProps> = ({ service, onEdit, onDelete }) => {
    const theme = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);



    const isCatering = service.category && service.category.toLowerCase() === 'catering';

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cardRef.current?.style.setProperty("--x", `${x}px`);
            cardRef.current?.style.setProperty("--y", `${y}px`);
        }
    };

    return (
        <Card
            ref={cardRef}
            onMouseMove={handleMouseMove}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.03)}`,
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                '&:hover': {
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '& .vendor-image': { transform: 'scale(1.05)' },
                    '& .card-shine': { opacity: 1 },
                }
            }}
        >
            {/* Image Section */}
            <Box sx={{ position: 'relative', pt: '60%' }}>
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
                    <Typography variant="caption" sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 800,
                        display: 'block',
                        fontSize: '0.6rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        lineHeight: 1
                    }}>
                        Starting At
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 900, fontSize: '0.9rem' }}>
                        {formatCurrency(service.price)} +
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
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {service.rating}
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                {/* Name and Location */}
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

                {/* Service Chips */}
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

                {/* Edit and Delete Actions */}
                <Box sx={{
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    pt: 2,
                    mt: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Tooltip title="Delete Service">
                        <IconButton
                            size="small"
                            onClick={() => onDelete(Number(service.id))}
                            sx={{
                                color: 'error.main',
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                borderRadius: '10px',
                                p: 0.8,
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                    borderColor: 'error.main',
                                }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                        onClick={() => onEdit(service)}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 800,
                            px: 2.5,
                            height: 36,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                    >
                        Edit Service
                    </Button>
                </Box>
            </CardContent>

            {/* Shine Overlay */}
            <Box
                className="card-shine"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    background: `radial-gradient(600px circle at var(--x) var(--y), ${alpha(theme.palette.primary.main, 0.08)}, transparent 40%)`,
                    opacity: 0,
                    transition: 'opacity 0.6s ease',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            />
        </Card>
    );
};

export default ServiceManageCard;