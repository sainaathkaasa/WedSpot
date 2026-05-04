import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    MenuItem,
    TextField,
    useTheme,
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
    subject: yup.string().required('Subject is required'),
    category: yup.string().required('Category is required'),
    type: yup.string().required('Type is required'),
    date: yup.string().required('Date is required'),
    description: yup.string().optional(),
});

const categories = [
    'Venue',
    'Photography',
    'Decoration',
    'Catering',
    'Music',
    'Makeup Artist',
    'Videography',
    'Trousseau',
    'Invitation'
];

const types = ['Inquiry', 'Booking'];

const AddRequest = () => {
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
            subject: '',
            category: '',
            type: '',
            date: '',
            description: '',
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        console.log('Submitting Request Data:', data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        success('Request submitted successfully!');
        navigate('/client/requests');
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
                    Add Request
                </Typography>

                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/client/requests"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/client/requests');
                        }}
                        sx={{ fontSize: '0.85rem', fontWeight: 500 }}
                    >
                        Requests
                    </Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Add Request
                    </Typography>
                </Breadcrumbs>
            </Box>

            <DashboardCard sx={{ p: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        {/* Request Details Section title */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                Request Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="subject"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Subject *"
                                        placeholder="e.g. Wedding Venue Inquiry"
                                        error={!!errors.subject}
                                        helperText={errors.subject?.message}
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
                                    Request Type *
                                </Typography>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            size="small"
                                            error={!!errors.type}
                                            helperText={errors.type?.message}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '10px',
                                                    height: '42px',
                                                    bgcolor: '#f8fafc'
                                                }
                                            }}
                                        >
                                            {types.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Date *"
                                        type="date"
                                        error={!!errors.date}
                                        helperText={errors.date?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Description"
                                        placeholder="Tell us more about your request..."
                                        multiline
                                        rows={4}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <FormButton
                                    variant="outlined"
                                    onClick={() => navigate('/client/requests')}
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

export default AddRequest;
