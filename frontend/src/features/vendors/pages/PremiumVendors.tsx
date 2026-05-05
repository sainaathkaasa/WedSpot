import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Container,
    InputAdornment,
    TextField,
    Button,
    Skeleton,
    IconButton,
    Pagination,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import VendorCard from '../components/VendorCard';
import SectorNavigation from '../components/CategoryNavigation';
import type { VendorCategory, VendorService } from '../types';
import { useVendors } from '../hooks';

const SECTORS: VendorCategory[] = [
    { id: 'all', name: 'All Services', icon: '📋', description: 'View all' }, // Added explicit All
    { id: 'floral', name: 'Floral Decoration', icon: '🌸', description: 'Artisanal floral designs' },
    { id: 'coordination', name: 'Wedding Coordination', icon: '📋', description: 'Seamless planning' },
    { id: 'photography', name: 'Cinematic Photoshoot', icon: '📸', description: 'Visual storytelling' },
    { id: 'makeup', name: 'Luxury Makeup', icon: '💄', description: 'Premium beauty services' },
    { id: 'invitations', name: 'Elegant Invitations', icon: '✉️', description: 'Custom stationery' },
    { id: 'catering', name: 'Premium Catering', icon: '🍽️', description: 'Gourmet culinary' },
];

const ITEMS_PER_PAGE = 9; // Increased for professional density (3x3 grid)

const PremiumVendors: React.FC = () => {
    const [activeSector, setActiveSector] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const { data: response, isLoading, isError } = useVendors();

    const allServices = response?.data || [];

    // Filter Logic - Memoized
    const filteredVendors = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        return allServices.filter((service: VendorService) => {
            const matchesSector = activeSector === 'all' || service.category?.toLowerCase() === activeSector.toLowerCase();
            const matchesSearch = !query || 
                service.name.toLowerCase().includes(query) ||
                service.description.toLowerCase().includes(query);
            return matchesSector && matchesSearch;
        });
    }, [activeSector, searchQuery, allServices]);

    const paginatedVendors = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredVendors.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredVendors, page]);

    const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);

    // Handlers
    const handleSectorChange = useCallback((id: string) => {
        setActiveSector(id);
        setPage(1); // Reset page on filter
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset page on search
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'instant' }); // 'instant' is more professional than 'smooth'
    };

    if (isError) {
        return (
            <Box sx={{ py: 20, textAlign: 'center' }}>
                <Typography variant="h6" color="error">System Unavailable</Typography>
                <Typography color="text.secondary">Please contact support if the issue persists.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 10 }}>
            <Container maxWidth="xl">
                <SectorNavigation
                    categories={SECTORS}
                    activeCategoryId={activeSector}
                    onCategoryChange={handleSectorChange}
                />

                <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search vendors by name or service..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="small"
                        sx={{ 
                            width: { xs: '100%', md: 400 },
                            bgcolor: 'background.paper'
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <IconButton size="small" onClick={() => { setSearchQuery(''); setPage(1); }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )
                        }}
                    />
                    <Button 
                        variant="outlined" 
                        startIcon={<FilterIcon />} 
                        sx={{ color: 'text.primary', borderColor: 'divider', textTransform: 'none' }}
                    >
                        Filters
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    {isLoading ? (
                        Array.from(new Array(ITEMS_PER_PAGE)).map((_, i) => (
                            <Grid item xs={12} sm={6} lg={4} key={i}>
                                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
                                <Skeleton width="60%" sx={{ mt: 1 }} />
                                <Skeleton width="40%" />
                            </Grid>
                        ))
                    ) : paginatedVendors.length > 0 ? (
                        paginatedVendors.map((vendor: VendorService) => (
                            <Grid item xs={12} sm={6} lg={4} key={vendor.id}>
                                <VendorCard service={vendor} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    No records found matching your criteria.
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {totalPages > 1 && (
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            shape="rounded"
                            color="primary"
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default PremiumVendors;
