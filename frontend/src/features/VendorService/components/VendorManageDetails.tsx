import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    MenuItem,
    Chip,
    Stack,
    alpha,
    useTheme,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Add as AddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import { VENDOR_SERVICE } from '@/features/VendorService/api';
import type { VendorFormData } from '../types';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { DashboardCard } from '@/features/dashboard';
import { InputField } from '@/components/UI/Form';
import { FormButton } from '@/components/UI/Button';
import type { VendorService } from '@/entities/vendor-service';
import { useState } from 'react';
import type { APIResponse } from '@/api/types';
import type { AxiosError } from 'axios';


const SECTOR_OPTIONS = [
    { label: 'Floral', value: 'floral' },
    { label: 'Coordination', value: 'coordination' },
    { label: 'Photography', value: 'photography' },
    { label: 'Makeup', value: 'makeup' },
    { label: 'Invitations', value: 'invitations' },
    { label: 'Catering', value: 'catering' },
] as const;

const schema: yup.ObjectSchema<VendorFormData> = yup.object().shape({
    name: yup.string().required('Service name is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().required('Price is required'),
    location: yup.string().required('Location is required'),
    category: yup.string().required('Category is required'),
    imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
    tags: yup
        .array()
        .of(yup.string().required())
        .min(1, 'Add at least one tag')
        .required(),
});


const VendorManageDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { success, error } = useSnackbar();
    const isEditMode = !!id;
    const [serviceInput, setServiceInput] = useState('');

    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<VendorFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            location: '',
            category: '',
            imageUrl: '',
            tags: [],
        },
    });

    const services = watch('tags') as string[];

    // Fetch existing data in edit mode
    const { data: vendorData, isLoading: isFetching } = useQuery({
        queryKey: ['vendor', id],
        queryFn: () => VENDOR_SERVICE.getById(Number(id)),
        enabled: isEditMode,
        select: (response) => response.data,
    });

    // Separate useEffect to populate form when data arrives
    React.useEffect(() => {
        if (!vendorData) return;
        reset({
            name: vendorData.name,
            description: vendorData.description,
            price: vendorData.price,
            location: vendorData.location,
            category: vendorData.category,
            imageUrl: vendorData.imageUrl,
            tags: vendorData.tags,
        });
    }, [reset, vendorData]);

    const { mutate, isPending } = useMutation<APIResponse<VendorService | void>, AxiosError<{ message?: string }>, VendorFormData>({
        mutationFn: (data: VendorFormData) =>
            isEditMode
                ? VENDOR_SERVICE.update(Number(id), data)
                : VENDOR_SERVICE.create(data),
        onSuccess: () => {
            success(isEditMode ? 'Service updated successfully!' : 'Service created successfully!');
            navigate('/vendor/services');
        },
        onError: (err) => {
            error(err.response?.data?.message || 'Something went wrong. Please try again.');
        },
    });

    const handleAddService = () => {
        const trimmed = serviceInput.trim();
        if (trimmed && !services.includes(trimmed)) {
            setValue('tags', [...services, trimmed]);
        }
        setServiceInput('');
    };

    const handleRemoveService = (tag: string) => {
        setValue('tags', services.filter((s) => s !== tag));
    };

    const handleServiceKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddService();
        }
    };

    const onSubmit = (data: VendorFormData) => {
        mutate(data);
    };

    if (isFetching && isEditMode) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {isEditMode ? 'Edit Service' : 'Add Service'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {isEditMode ? 'Update your service details below.' : 'Fill in the details to list a new service.'}
                    </Typography>
                </Box>

                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}
                >
                    Back
                </Button>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>

                    {/* Basic Details */}
                    <Grid item xs={12} md={8}>
                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                                Basic Details
                            </Typography>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Service Name *"
                                                placeholder="e.g. Royal Catering Co."
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                InputProps={{ sx: { height: '42px' } }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Location *"
                                                placeholder="e.g. Mumbai, India"
                                                error={!!errors.location}
                                                helperText={errors.location?.message}
                                                InputProps={{ sx: { height: '42px' } }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="price"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Price Range *"
                                                placeholder="e.g. 50000"
                                                error={!!errors.price}
                                                helperText={errors.price?.message}
                                                InputProps={{
                                                    sx: { height: '42px' },
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>₹</Typography>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography
                                            component="label"
                                            sx={{
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                color: '#334155',
                                                mb: 0.75,
                                                display: 'block',
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                        >
                                            Category *
                                        </Typography>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    fullWidth
                                                    size="small"
                                                    error={!!errors.category}
                                                    helperText={errors.category?.message}
                                                    InputProps={{ sx: { borderRadius: '10px', height: '42px', bgcolor: '#f8fafc' } }}
                                                >
                                                    {SECTOR_OPTIONS.map((sector) => (
                                                        <MenuItem key={sector.value} value={sector.value}>
                                                            {sector.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                label="Description *"
                                                placeholder="Describe your service in detail..."
                                                multiline
                                                rows={4}
                                                error={!!errors.description}
                                                helperText={errors.description?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                            </Grid>
                        </DashboardCard>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>

                            {/* Image */}
                            <DashboardCard sx={{ p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                                    Cover Image
                                </Typography>
                                <Controller
                                    name="imageUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <InputField
                                            {...field}
                                            label="Image URL *"
                                            placeholder="https://example.com/image.jpg"
                                            error={!!errors.imageUrl}
                                            helperText={errors.imageUrl?.message}
                                            InputProps={{ sx: { height: '42px' } }}
                                        />
                                    )}
                                />
                                {/* Preview */}
                                {watch('imageUrl') && (
                                    <Box sx={{
                                        mt: 2,
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        height: 160,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                    }}>
                                        <img
                                            src={watch('imageUrl')}
                                            alt="preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </Box>
                                )}
                            </DashboardCard>

                            {/* Service Tags */}
                            <DashboardCard sx={{ p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                                    Service Tags *
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                                    Press Enter or click Add to add a tag.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        onKeyDown={handleServiceKeyDown}
                                        placeholder="e.g. Floral Arrangement"
                                        InputProps={{ sx: { borderRadius: '10px', bgcolor: '#f8fafc' } }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddService}
                                        sx={{ borderRadius: '10px', minWidth: 42, px: 1.5, flexShrink: 0 }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </Button>
                                </Box>

                                {errors.tags && (
                                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                                        {errors.tags.message}
                                    </Typography>
                                )}

                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {services.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            onDelete={() => handleRemoveService(tag)}
                                            deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                color: 'primary.main',
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                                '& .MuiChip-deleteIcon': { color: 'primary.main' }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </DashboardCard>

                        </Stack>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <FormButton
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                sx={{
                                    width: 'auto', minWidth: '100px', px: 3, height: '40px',
                                    fontSize: '0.9rem', py: 0, background: 'transparent',
                                    color: 'text.secondary', borderColor: '#e2e8f0', boxShadow: 'none',
                                    '&:hover': { background: '#f1f5f9', borderColor: '#cbd5e1', transform: 'none' }
                                }}
                            >
                                Cancel
                            </FormButton>
                            <FormButton
                                type="submit"
                                loading={isPending}
                                sx={{ width: 'auto', minWidth: '120px', px: 4, height: '40px', fontSize: '0.9rem', py: 0 }}
                            >
                                {isEditMode ? 'Update Service' : 'Add Service'}
                            </FormButton>
                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
};

export default VendorManageDetails;
