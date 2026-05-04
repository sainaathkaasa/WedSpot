import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    MenuItem,
    TextField,
    useTheme,
    FormControlLabel,
    Switch,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DashboardCard } from '@/features/dashboard';
import { InputField } from '@/components/UI/Form';
import { FormButton } from '@/components/UI/Button';
import { useSnackbar } from '@/contexts/snackbarContextValue';

// Validation Schema
const schema = yup.object().shape({
    name: yup.string().required('Business Name is required'),
    category: yup.string().required('Category is required'),
    contactPerson: yup.string().required('Contact Person is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup.string().required('Phone Number is required'),
    location: yup.string().required('Location is required'),
    status: yup.boolean().default(true),
});

const categories = [
    'Venue', 
    'Photography', 
    'Decoration', 
    'Catering', 
    'Music/DJ', 
    'Makeup Artist', 
    'Videography', 
    'Choreographer',
    'Invitation Cards'
];

const AddVendor = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { success } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            category: '',
            contactPerson: '',
            email: '',
            phone: '',
            location: '',
            status: true,
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        console.log('Submitting Vendor Data:', data);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setLoading(false);
        success('Vendor added successfully!');
        navigate('/manager/vendors');
    };

    return (
        <Box sx={{ p: 0 }}>
            {/* Header: Title on Left, Breadcrumbs on Right */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 800, 
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Add Vendor
                </Typography>

                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" />} 
                    aria-label="breadcrumb"
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/manager/vendors"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/manager/vendors');
                        }}
                        sx={{ fontSize: '0.85rem', fontWeight: 500 }}
                    >
                        Vendors
                    </Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Add Vendor
                    </Typography>
                </Breadcrumbs>
            </Box>

            <DashboardCard sx={{ p: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        {/* Business Details Section title */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                Business Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Business Name *"
                                        placeholder="Enter vendor's business name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography
                                    component="label"
                                    sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "#334155",
                                        mb: 0.75,
                                        display: "block",
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
                                            InputProps={{
                                                sx: { 
                                                    borderRadius: '10px',
                                                    height: '42px',
                                                    bgcolor: '#f8fafc'
                                                }
                                            }}
                                        >
                                            {categories.map((cat) => (
                                                <MenuItem key={cat} value={cat}>
                                                    {cat}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Location *"
                                        placeholder="e.g. Mumbai, Delhi"
                                        error={!!errors.location}
                                        helperText={errors.location?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Contact Information Section title */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                Contact Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="contactPerson"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Contact Person *"
                                        placeholder="Manager or Owner Name"
                                        error={!!errors.contactPerson}
                                        helperText={errors.contactPerson?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Email Address *"
                                        placeholder="vendor@example.com"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Phone Number *"
                                        placeholder="+91 XXXXX XXXXX"
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', pb: '1px' }}>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    {...field} 
                                                    checked={field.value} 
                                                    color="primary" 
                                                />
                                            }
                                            label={
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                    Active Status
                                                </Typography>
                                            }
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <FormButton
                                    variant="outlined"
                                    onClick={() => navigate('/manager/vendors')}
                                    sx={{ 
                                        width: 'auto', 
                                        minWidth: '100px',
                                        px: 3,
                                        height: '40px',
                                        fontSize: '0.9rem',
                                        py: 0,
                                        background: 'transparent',
                                        color: 'text.secondary',
                                        borderColor: '#e2e8f0',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: '#f1f5f9',
                                            borderColor: '#cbd5e1',
                                            transform: 'none'
                                        }
                                    }}
                                >
                                    Cancel
                                </FormButton>
                                <FormButton
                                    type="submit"
                                    loading={loading}
                                    sx={{ 
                                        width: 'auto', 
                                        minWidth: '100px',
                                        px: 4, 
                                        height: '40px', 
                                        fontSize: '0.9rem',
                                        py: 0
                                    }}
                                >
                                    Save
                                </FormButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DashboardCard>
        </Box>
    );
};

export default AddVendor;
