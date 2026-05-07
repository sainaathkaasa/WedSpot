import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    alpha,
    useTheme,
    Container
} from '@mui/material';
import { ShoppingCart as CartIcon, LocalMall as MallIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import CartItemCard from './CartItemCard';
import type { CartItemProps } from './CartItemCard';
import CartSummary from './CartSummary';

export interface CartListProps {
    items: CartItemProps[];
    subtotal: number;
    total: number;
    onRemove: (id: string, name: string) => void;
    onCheckout: () => void;
    onExplore: () => void;
}

/**
 * Premium Unified Cart List Component
 * Manages the layout for items and the summary panel.
 */
const CartList: React.FC<CartListProps> = ({
    items,
    subtotal,
    total,
    onRemove,
    onCheckout,
    onExplore
}) => {
    const theme = useTheme();

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 15, textAlign: 'center' }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            width: 140,
                            height: 140,
                            borderRadius: '40px',
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`
                        }}
                    >
                        <CartIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.2) }} />
                    </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary', letterSpacing: '-0.03em' }}>
                    Your selections are waiting
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5, fontSize: '1.1rem', maxWidth: 500, mx: 'auto', fontWeight: 500 }}>
                    Explore our premium wedding services and start crafting your perfect celebration today.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onExplore}
                    startIcon={<MallIcon />}
                    sx={{
                        borderRadius: "16px",
                        textTransform: 'none',
                        px: 6,
                        py: 2,
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 15px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
                        }
                    }}
                >
                    Explore Catalog
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ maxWidth: '100%', mx: 0, px: { xs: 1.5, md: 2 }, pt: 0 }}>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        mb: 1
                    }}
                >
                    Review Selections
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    You have {items.length} premium services in your selection.
                </Typography>
            </Box>

            <Grid container spacing={5}>
                {/* Cart Items List */}
                <Grid item xs={12} lg={8}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2.5,
                            position: 'relative',
                            ...(items.length > 3 && {
                                maxHeight: { xs: '550px', md: '620px' },
                                overflowY: 'auto',
                                pr: 1.5,
                                py: 2, // Extra vertical padding for smooth mask experience

                                // Premium Fading Mask
                                maskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',

                                // Premium Custom Scrollbar
                                '&::-webkit-scrollbar': {
                                    width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'transparent',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: alpha(theme.palette.primary.main, 0.08),
                                    borderRadius: '10px',
                                    transition: 'all 0.3s ease',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: alpha(theme.palette.primary.main, 0.15),
                                },
                                '&:hover::-webkit-scrollbar-thumb': {
                                    background: alpha(theme.palette.primary.main, 0.12),
                                },
                                scrollBehavior: 'smooth'
                            })
                        }}
                    >
                        <AnimatePresence initial={false}>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } }}
                                    layout
                                >
                                    <CartItemCard
                                        {...item}
                                        onRemove={() => onRemove(item.id, item.name)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Box>
                </Grid>

                {/* Summary Panel */}
                <Grid item xs={12} lg={4}>
                    <CartSummary
                        subtotal={subtotal}
                        itemCount={items.length}
                        total={total}
                        onCheckout={onCheckout}
                        disabled={items.length === 0}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default CartList;
