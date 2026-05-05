import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    alpha,
    Badge,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Drawer,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Pagination,
    Radio,
    RadioGroup,
    Skeleton,
    Slider,
    TextField,
    Typography,
    useTheme,
    type SxProps,
    type Theme,
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type { AxiosError } from 'axios';
import ServiceManageCard from '@/features/VendorService/components/ServiceManageCard';
import { CategoryNavigation } from '@/features/vendors/components';
import type { VendorCategory, VendorService } from '@/entities/vendor-service';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { useUser } from '@/features/user';
import { useVendorServices, useDeleteVendorService } from '../hooks';

const CATEGORIES: VendorCategory[] = [
    { id: 'floral', name: 'Floral Decoration', icon: '\u{1F338}', description: 'Artisanal floral designs for every theme' },
    { id: 'coordination', name: 'Wedding Coordination', icon: '\u{1F4CB}', description: 'Seamless planning and on-day execution' },
    { id: 'photography', name: 'Cinematic Photoshoot', icon: '\u{1F4F8}', description: 'Visual storytelling at its finest' },
    { id: 'makeup', name: 'Luxury Makeup Artist', icon: '\u{1F484}', description: 'Premium bridal and party beauty services' },
    { id: 'invitations', name: 'Elegant Invitations', icon: '\u2709\uFE0F', description: 'Custom-designed stationery and invites' },
    { id: 'catering', name: 'Premium Catering', icon: '\u{1F37D}\uFE0F', description: 'Gourmet culinary experiences' },
];

const ITEMS_PER_PAGE = 6;
const MAX_PRICE = 500000;
const PRICE_STEP = 5000;
type SortOption = 'price_asc' | 'price_desc' | 'rating_desc' | 'newest' | 'most_reviews';

interface FilterState {
    sort: SortOption;
    priceRange: [number, number];
    location: string;
}

interface ApiErrorResponse {
    message?: string;
}

const DEFAULT_FILTERS: FilterState = {
    sort: 'newest',
    priceRange: [0, MAX_PRICE],
    location: '',
};

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Rating: High to Low' },
    { value: 'most_reviews', label: 'Most Reviews' },
];

const headerOuterSx: SxProps<Theme> = {
    bgcolor: 'background.default',
    pt: { xs: 1, md: 1.5 },
    pb: 0,
};

const headerContentSx: SxProps<Theme> = (theme) => ({
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: 'space-between',
    gap: { xs: 2, md: 3 },
    py: { xs: 1.5, md: 2 },
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
});

const headerIntroSx: SxProps<Theme> = {
    minWidth: 0,
};

const headerEyebrowSx: SxProps<Theme> = {
    mb: 0.75,
    color: 'primary.main',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
};

const headerTitleSx: SxProps<Theme> = {
    color: 'text.primary',
    fontSize: { xs: '1.45rem', md: '1.9rem' },
    fontWeight: 850,
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
};

const headerSubtitleSx: SxProps<Theme> = {
    mt: 1,
    color: 'text.secondary',
    fontWeight: 600,
};

const headerActionsSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: 1.5,
    width: { xs: '100%', md: 'auto' },
};

const pageContentSx: SxProps<Theme> = {
    mt: 0,
    bgcolor: 'background.default',
    pt: 0,
    pb: 1,
};

const titleRowSx: SxProps<Theme> = {
    mb: 3,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    justifyContent: 'space-between',
    alignItems: { xs: 'stretch', sm: 'center' },
};

const pageTitleSx: SxProps<Theme> = {
    fontWeight: 800,
    color: 'text.primary',
    letterSpacing: '-0.02em',
};

const contentContainerSx: SxProps<Theme> = {
    mt: 0,
};

const emptyStateSx: SxProps<Theme> = {
    width: '100%',
    py: 10,
    textAlign: 'center',
};

const emptyStateTextSx: SxProps<Theme> = {
    color: 'text.disabled',
    fontWeight: 700,
};

const drawerPaperSx: SxProps<Theme> = {
    width: { xs: '100%', sm: 380 },
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: { sm: '16px 0 0 16px' },
    overflow: 'hidden',
};

const drawerHeaderSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 2.5,
    py: 1.75,
};

const drawerSectionTitleSx: SxProps<Theme> = {
    fontWeight: 800,
    mb: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.7rem',
    color: 'text.secondary',
};

const drawerBodySx: SxProps<Theme> = {
    px: 2.5,
    py: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
    flex: 1,
};

const drawerSectionSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
};

const drawerActionsSx: SxProps<Theme> = {
    display: 'flex',
    gap: 1,
    px: 2.5,
    py: 1.5,
    bgcolor: 'background.paper',
    borderTop: '1px solid',
    borderColor: 'divider',
    flexShrink: 0,
};

const dialogPaperSx: SxProps<Theme> = {
    borderRadius: '14px',
    p: 1,
};

const dialogActionsSx: SxProps<Theme> = {
    px: 3,
    pb: 2,
    gap: 1,
};

const applyButtonSx: SxProps<Theme> = {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 800,
    height: 40,
};

const dialogButtonSx: SxProps<Theme> = {
    borderRadius: '10px',
    textTransform: 'none',
};

const deleteButtonSx: SxProps<Theme> = {
    ...dialogButtonSx,
    minWidth: 80,
};

const getErrorMessage = (err: unknown): string => {
    const axiosError = err as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message ?? axiosError.message ?? 'Failed to delete service.';
};

const sortServices = (services: VendorService[], sort: SortOption): VendorService[] => {
    const sortedServices = [...services];

    switch (sort) {
        case 'price_asc':
            return sortedServices.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sortedServices.sort((a, b) => b.price - a.price);
        case 'rating_desc':
            return sortedServices.sort((a, b) => b.rating - a.rating);
        case 'most_reviews':
            return sortedServices.sort((a, b) => b.ratingCount - a.ratingCount);
        case 'newest':
        default:
            return services;
    }
};

const isDefaultPriceRange = (priceRange: FilterState['priceRange']): boolean => (
    priceRange[0] === DEFAULT_FILTERS.priceRange[0] && priceRange[1] === DEFAULT_FILTERS.priceRange[1]
);

interface FilterDrawerProps {
    open: boolean;
    filters: FilterState;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    onReset: () => void;
}

const FilterDrawer = React.memo(({ open, filters, onClose, onApply, onReset }: FilterDrawerProps) => {
    const theme = useTheme();
    const [draftFilters, setDraftFilters] = useState<FilterState>(filters);

    useEffect(() => {
        if (open) {
            setDraftFilters(filters);
        }
    }, [filters, open]);

    const closeDrawerButtonSx = useMemo<SxProps<Theme>>(() => ({
        bgcolor: alpha(theme.palette.divider, 0.06),
        borderRadius: '10px',
    }), [theme]);

    const radioOptionSx = useCallback((isSelected: boolean): SxProps<Theme> => ({
        m: 0,
        px: 1,
        py: 0.15,
        borderRadius: '10px',
        border: `1px solid ${isSelected ? alpha(theme.palette.primary.main, 0.3) : 'transparent'}`,
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
    }), [theme]);

    const locationInputProps = useMemo(() => ({
        sx: {
            borderRadius: '10px',
            bgcolor: alpha(theme.palette.divider, 0.04),
        },
    }), [theme]);

    const resetButtonSx = useMemo<SxProps<Theme>>(() => ({
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 700,
        height: 40,
        borderColor: alpha(theme.palette.divider, 0.3),
        color: 'text.secondary',
        '&:hover': { bgcolor: alpha(theme.palette.divider, 0.06) },
    }), [theme]);

    const sliderSx: SxProps<Theme> = {
        '& .MuiSlider-thumb': { borderRadius: '8px', width: 20, height: 20 },
        '& .MuiSlider-valueLabel': { borderRadius: '8px', fontWeight: 700 },
    };

    const handleSortChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDraftFilters((prev) => ({ ...prev, sort: event.target.value as SortOption }));
    }, []);

    const handlePriceRangeChange = useCallback((_: Event, value: number | number[]) => {
        setDraftFilters((prev) => ({ ...prev, priceRange: value as [number, number] }));
    }, []);

    const handleLocationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDraftFilters((prev) => ({ ...prev, location: event.target.value }));
    }, []);

    const handleApply = useCallback(() => {
        onApply(draftFilters);
    }, [draftFilters, onApply]);

    const handleReset = useCallback(() => {
        setDraftFilters(DEFAULT_FILTERS);
        onReset();
    }, [onReset]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: drawerPaperSx }}
        >
            <Box sx={drawerHeaderSx}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Sort & Filter</Typography>
                <IconButton onClick={onClose} sx={closeDrawerButtonSx}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Divider />

            <Box sx={drawerBodySx}>
                <Box sx={drawerSectionSx}>
                    <Typography variant="subtitle2" sx={drawerSectionTitleSx}>
                        Sort By
                    </Typography>
                    <RadioGroup value={draftFilters.sort} onChange={handleSortChange}>
                        {SORT_OPTIONS.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio size="small" />}
                                label={(
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {option.label}
                                    </Typography>
                                )}
                                sx={radioOptionSx(draftFilters.sort === option.value)}
                            />
                        ))}
                    </RadioGroup>
                </Box>

                <Divider />

                <Box sx={drawerSectionSx}>
                    <Typography variant="subtitle2" sx={drawerSectionTitleSx}>
                        Price Range
                    </Typography>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={draftFilters.priceRange}
                            onChange={handlePriceRangeChange}
                            min={0}
                            max={MAX_PRICE}
                            step={PRICE_STEP}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `\u20B9${(value / 1000).toFixed(0)}k`}
                            sx={sliderSx}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                {`\u20B9${(draftFilters.priceRange[0] / 1000).toFixed(0)}k`}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                {`\u20B9${(draftFilters.priceRange[1] / 1000).toFixed(0)}k`}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider />

                <Box sx={drawerSectionSx}>
                    <Typography variant="subtitle2" sx={drawerSectionTitleSx}>
                        Location
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="e.g. Mumbai, Delhi..."
                        value={draftFilters.location}
                        onChange={handleLocationChange}
                        InputProps={locationInputProps}
                    />
                </Box>
            </Box>

            <Box sx={drawerActionsSx}>
                <Button fullWidth variant="outlined" onClick={handleReset} sx={resetButtonSx}>
                    Reset
                </Button>
                <Button fullWidth variant="contained" onClick={handleApply} sx={applyButtonSx}>
                    Apply Filters
                </Button>
            </Box>
        </Drawer>
    );
});

const VendorServicesPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useUser();
    const { success, error } = useSnackbar();
    const userId = user?.id ? Number(user.id) : undefined;

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

    useEffect(() => {
        setPage(1);
    }, [activeCategory, searchQuery, filters]);

    const { data: response, isLoading } = useVendorServices(userId as number);
    const allServices = (response?.data ?? []) as VendorService[];

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const normalizedLocationFilter = filters.location.trim().toLowerCase();

    const filteredAndSorted = useMemo(() => {
        const filteredServices = allServices.filter((service) => {
            const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
            const matchesSearch = !normalizedSearchQuery
                || service.name.toLowerCase().includes(normalizedSearchQuery)
                || service.description.toLowerCase().includes(normalizedSearchQuery);
            const matchesPrice = service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
            const matchesLocation = !normalizedLocationFilter
                || service.location.toLowerCase().includes(normalizedLocationFilter);

            return matchesCategory && matchesSearch && matchesPrice && matchesLocation;
        });

        return sortServices(filteredServices, filters.sort);
    }, [activeCategory, allServices, filters.priceRange, filters.sort, normalizedLocationFilter, normalizedSearchQuery]);

    const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (totalPages > 0 && page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedServices = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAndSorted, page]);

    const activeFilterCount = useMemo(() => {
        return Number(filters.sort !== DEFAULT_FILTERS.sort)
            + Number(!isDefaultPriceRange(filters.priceRange))
            + Number(Boolean(filters.location.trim()));
    }, [filters.location, filters.priceRange, filters.sort]);

    const activeCategoryName = useMemo(
        () => CATEGORIES.find((category) => category.id === activeCategory)?.name,
        [activeCategory],
    );

    const searchFieldSx = useMemo<SxProps<Theme>>(() => ({
        width: { xs: '100%', sm: 360, md: 420 },
        '& .MuiOutlinedInput-root': {
            height: 48,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.96),
            fontWeight: 700,
            fontSize: '0.85rem',
            border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
            '& fieldset': { border: 'none' },
            '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.28),
            },
            '&.Mui-focused': {
                borderColor: alpha(theme.palette.primary.main, 0.45),
            },
        },
    }), [theme]);

    const searchIconWrapperSx = useMemo<SxProps<Theme>>(() => ({
        p: 0.8,
        display: 'flex',
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
    }), [theme]);

    const clearSearchButtonSx = useMemo<SxProps<Theme>>(() => ({
        bgcolor: alpha(theme.palette.divider, 0.06),
        '&:hover': {
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: 'error.main',
        },
    }), [theme]);

    const addButtonSx: SxProps<Theme> = {
        height: 48,
        px: 2.4,
        borderRadius: 2,
        bgcolor: 'primary.main',
        color: 'white',
        fontWeight: 800,
        textTransform: 'none',
        flexShrink: 0,
        '&:hover': { bgcolor: 'primary.dark' },
    };

    const filterButtonSx = useMemo<SxProps<Theme>>(() => ({
        fontWeight: 700,
        textTransform: 'none',
        borderRadius: '10px',
        height: 42,
        alignSelf: { xs: 'flex-start', sm: 'center' },
        color: activeFilterCount > 0 ? 'white' : 'text.secondary',
        borderColor: alpha(theme.palette.divider, 0.3),
    }), [activeFilterCount, theme]);

    const paginationWrapperSx = useMemo<SxProps<Theme>>(() => ({
        mt: 8,
        display: 'flex',
        justifyContent: 'center',
        '& .MuiPagination-ul': { gap: 1 },
        '& .MuiPaginationItem-root': {
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
            },
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
        },
    }), [theme]);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    const handleAddService = useCallback(() => {
        navigate('/vendor/services/add');
    }, [navigate]);

    const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleCategoryChange = useCallback((id: string) => {
        setActiveCategory(id);
    }, []);

    const handleEdit = useCallback((service: VendorService) => {
        navigate(`/vendor/services/edit/${service.id}`);
    }, [navigate]);

    const { mutate: deleteService, isPending: isDeleting } = useDeleteVendorService();

    const handleDeleteResult = (response: { message?: string }, err: unknown) => {
        if (response) {
            success(response.message ?? 'Service deleted successfully');
        } else {
            error(getErrorMessage(err));
        }
        setDeleteTarget(null);
    };

    const handleDeleteClick = useCallback((serviceId: number) => {
        setDeleteTarget(serviceId);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (deleteTarget !== null) {
            deleteService(deleteTarget, {
                onSuccess: (response) => handleDeleteResult(response, null),
                onError: (err) => handleDeleteResult(null as never, err),
            });
        }
    }, [deleteService, deleteTarget]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteTarget(null);
    }, []);

    const handleOpenDrawer = useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    const handleApplyFilters = useCallback((nextFilters: FilterState) => {
        setFilters(nextFilters);
        setPage(1);
        setDrawerOpen(false);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    }, []);

    const searchStartAdornment = useMemo(() => (
        <InputAdornment position="start" sx={{ mr: 1.5 }}>
            <Box sx={searchIconWrapperSx}>
                <SearchIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            </Box>
        </InputAdornment>
    ), [searchIconWrapperSx]);

    const searchEndAdornment = useMemo(() => {
        if (!searchQuery) {
            return null;
        }

        return (
            <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch} sx={clearSearchButtonSx}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </InputAdornment>
        );
    }, [clearSearchButtonSx, handleClearSearch, searchQuery]);

    const searchInputProps = useMemo(() => ({
        startAdornment: searchStartAdornment,
        endAdornment: searchEndAdornment,
    }), [searchEndAdornment, searchStartAdornment]);

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            <Box sx={headerOuterSx}>
                <Container maxWidth={false} disableGutters>
                    <Box sx={headerContentSx}>
                        <Box sx={headerIntroSx}>
                            <Typography sx={headerEyebrowSx}>Vendor Workspace</Typography>
                            <Typography variant="h4" sx={headerTitleSx}>
                                Manage your services
                            </Typography>
                            <Typography variant="body2" sx={headerSubtitleSx}>
                                {allServices.length} total services | {filteredAndSorted.length} matching current view
                            </Typography>
                        </Box>

                        <Box sx={headerActionsSx}>
                            <TextField
                                placeholder="Search services"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                sx={searchFieldSx}
                                InputProps={searchInputProps}
                            />

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddService}
                                sx={addButtonSx}
                            >
                                Add Service
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Box sx={pageContentSx}>
                <CategoryNavigation
                    categories={CATEGORIES}
                    activeCategoryId={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />

                <Container maxWidth={false} disableGutters sx={contentContainerSx}>
                    <Box sx={titleRowSx}>
                        <Box>
                            <Typography variant="h5" sx={pageTitleSx}>
                                {activeCategory === 'all' ? 'My Services' : `Services in ${activeCategoryName}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                                Review, update, and organize your listed vendor services.
                            </Typography>
                        </Box>

                        <Badge badgeContent={activeFilterCount} color="primary">
                            <Button
                                startIcon={<FilterIcon />}
                                onClick={handleOpenDrawer}
                                variant={activeFilterCount > 0 ? 'contained' : 'outlined'}
                                sx={filterButtonSx}
                            >
                                Sort & Filter
                            </Button>
                        </Badge>
                    </Box>

                    <Grid container spacing={4}>
                        {isLoading ? (
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={`skeleton-${index}`}>
                                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
                                    <Box sx={{ pt: 2 }}>
                                        <Skeleton width="60%" height={32} />
                                        <Skeleton width="40%" height={24} />
                                    </Box>
                                </Grid>
                            ))
                        ) : paginatedServices.length > 0 ? (
                            paginatedServices.map((service) => (
                                <Grid item xs={12} sm={6} lg={4} key={service.id}>
                                    <ServiceManageCard
                                        service={service}
                                        onDelete={handleDeleteClick}
                                        onEdit={handleEdit}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Box sx={emptyStateSx}>
                                <Typography variant="h6" sx={emptyStateTextSx}>
                                    No services found matching your current filters.
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={paginationWrapperSx}>
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

            <FilterDrawer
                open={drawerOpen}
                filters={filters}
                onClose={handleCloseDrawer}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            <Dialog
                open={deleteTarget !== null}
                onClose={handleDeleteCancel}
                PaperProps={{ sx: dialogPaperSx }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete Service?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently delete the service and cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={dialogActionsSx}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        disabled={isDeleting}
                        sx={dialogButtonSx}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                        sx={deleteButtonSx}
                    >
                        {isDeleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VendorServicesPage;
