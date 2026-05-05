import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Container,
    useTheme,
    alpha,
    Button,
    Skeleton,
    Pagination,
    InputAdornment,
    TextField
} from '@mui/material';
import {
    Search as SearchIcon,
    Verified as VerifiedIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import VendorCard from '@/features/vendors/components/VendorCard';
import type { VendorService } from '@/entities/vendor-service';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { VENDOR_SERVICE } from '@/features/VendorService/api/vendor.api';

const ITEMS_PER_PAGE = 8;

const ProductsPage: React.FC = () => {
    const theme = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['all-marketplace-services'],
        queryFn: () => VENDOR_SERVICE.getAllServices()
    });

    const allServices = response?.data || [];

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return allServices.filter((service: VendorService) => {
            const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [searchQuery, allServices]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, page]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            {/* Premium Header Section */}
            <Box sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2.1rem', md: '3.5rem' },
                                mb: 2,
                                letterSpacing: '-0.04em',
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Marketplace Products
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
                            Curated elite services for extraordinary wedding events.
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        px: 3,
                        py: 2.5,
                        bgcolor: alpha(theme.palette.background.paper, 0.4),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 5,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Find your elite service partner..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '52px',
                                    borderRadius: '16px',
                                    bgcolor: 'background.paper',
                                    fontWeight: 600,
                                    '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <VerifiedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>Elite Only</Typography>
                                        </Box>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                        Elite Collections
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>
                            {filteredProducts.length} Results
                        </Typography>
                        <Button startIcon={<FilterIcon />} sx={{ fontWeight: 800, textTransform: 'none', color: 'text.secondary' }}>Filter</Button>
                    </Box>
                </Box>

                <Grid container spacing={4} component={motion.div} layout>
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            Array.from(new Array(8)).map((_, index) => (
                                <Grid item xs={12} sm={6} lg={4} xl={3} key={`skeleton-${index}`}>
                                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
                                    <Box sx={{ pt: 2 }}>
                                        <Skeleton width="60%" height={32} />
                                        <Skeleton width="40%" height={24} />
                                    </Box>
                                </Grid>
                            ))
                        ) : isError ? (
                            <Box sx={{ width: '100%', py: 10, textAlign: 'center' }}>
                                <Typography variant="h6" color="error" sx={{ fontWeight: 700 }}>
                                    Failed to load products. Please check your connection.
                                </Typography>
                            </Box>
                        ) : paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product: VendorService) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    xl={3}
                                    key={product.id.toString()}
                                    component={motion.div}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    layout
                                >
                                    <VendorCard service={product} />
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ width: '100%', py: 10, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'text.disabled', fontWeight: 700 }}>
                                    No elite services match your search.
                                </Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                </Grid>

                {/* Pagination Section */}
                {totalPages > 1 && (
                    <Box sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        '& .MuiPagination-ul': { gap: 1 },
                        '& .MuiPaginationItem-root': {
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            },
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                transform: 'translateY(-2px)'
                            }
                        }
                    }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            size="large"
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ProductsPage;
