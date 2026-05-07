import React from 'react';
import {
    CardMedia,
    Typography,
    Box,
    Button,
    alpha,
    useTheme,
    IconButton,
    Tooltip
} from '@mui/material';
import { DashboardCard } from '@/features/dashboard';
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

    const isCatering = service.category && service.category.toLowerCase() === 'catering';

    return (
        <DashboardCard
            noPadding
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: theme.dashboard.transition,
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

                {/* Status/Category Badge */}
                <Box sx={{
                    position: 'absolute',
                    top: theme.spacing(1.5),
                    left: theme.spacing(1.5),
                    bgcolor: alpha(isCatering ? theme.palette.secondary.main : theme.palette.primary.main, 0.95),
                    px: theme.spacing(1),
                    py: theme.spacing(0.5),
                    borderRadius: theme.shape.borderRadius,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(0.5),
                    zIndex: 1
                }}>
                    {isCatering ? <FoodIcon sx={{ fontSize: 12 }} /> : <CartIcon sx={{ fontSize: 12 }} />}
                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: theme.typography.caption.fontSize }}>
                        {service.category}
                    </Typography>
                </Box>

                {/* Rating Badge */}
                <Box sx={{
                    position: 'absolute',
                    top: theme.spacing(1.5),
                    right: theme.spacing(1.5),
                    bgcolor: 'background.paper',
                    px: theme.spacing(1),
                    py: theme.spacing(0.5),
                    borderRadius: theme.shape.borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(0.5),
                    border: `1px solid ${theme.palette.divider}`,
                    zIndex: 1
                }}>
                    <StarsIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {service.rating}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, p: theme.spacing(2), display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5) }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.3, mb: theme.spacing(0.5) }}>
                        {service.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(0.5) }}>
                        <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {service.location}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing(0.5) }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Starts at
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>
                        {formatCurrency(service.price)}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: theme.spacing(2),
                    mt: 'auto',
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => onDelete(Number(service.id))}
                            sx={{
                                color: 'text.secondary',
                                transition: theme.dashboard.transition,
                                '&:hover': {
                                    color: 'error.main',
                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                }
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                        onClick={() => onEdit(service)}
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            textTransform: 'none',
                            fontWeight: 700,
                            transition: theme.dashboard.transition,
                        }}
                    >
                        Manage
                    </Button>
                </Box>
            </Box>
        </DashboardCard>
    );
};

export default ServiceManageCard;