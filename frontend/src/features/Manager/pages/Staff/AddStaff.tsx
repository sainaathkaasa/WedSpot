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
    name: yup.string().required('Staff Name is required'),
    role: yup.string().required('Role is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup.string().required('Phone Number is required'),
    status: yup.string().required('Status is required'),
});

const roles = [
    'Wedding Coordinator',
    'Support Specialist',
    'Venue Liaison',
    'Vendor Relations',
    'Operations Lead'
];

const statuses = ['Available', 'Busy', 'On Leave'];

const AddStaff = () => {
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
            role: '',
            email: '',
            phone: '',
            status: 'Available',
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        console.log('Submitting Staff Data:', data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        success('Staff member added successfully!');
        navigate('/manager/staff');
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
                    Add Staff
                </Typography>

                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/manager/staff"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/manager/staff');
                        }}
                        sx={{ fontSize: '0.85rem', fontWeight: 500 }}
                    >
                        Staff
                    </Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Add Staff
                    </Typography>
                </Breadcrumbs>
            </Box>

            <DashboardCard sx={{ p: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        {/* Personal Details Section title */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                Personal Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Full Name *"
                                        placeholder="Enter staff full name"
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
                                    Role *
                                </Typography>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            size="small"
                                            error={!!errors.role}
                                            helperText={errors.role?.message}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '10px',
                                                    height: '42px',
                                                    bgcolor: '#f8fafc'
                                                }
                                            }}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>
                                                    {role}
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
                                    Current Status *
                                </Typography>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            size="small"
                                            error={!!errors.status}
                                            helperText={errors.status?.message}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '10px',
                                                    height: '42px',
                                                    bgcolor: '#f8fafc'
                                                }
                                            }}
                                        >
                                            {statuses.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>
                        </Grid>

                        {/* Contact Information Section title */}
                        {/* <Grid item xs={12} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                                Contact Information
                            </Typography>
                        </Grid> */}

                        <Grid item xs={12} md={4}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Email Address *"
                                        placeholder="alia@coordinator.com"
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

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <FormButton
                                    variant="outlined"
                                    onClick={() => navigate('/manager/staff')}
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

export default AddStaff;
