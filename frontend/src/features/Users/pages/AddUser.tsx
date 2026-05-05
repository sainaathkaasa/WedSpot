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
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, type FieldPath } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { DashboardCard } from '@/features/dashboard';
import { InputField } from '@/components/UI/Form';
import { FormButton } from '@/components/UI/Button';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { AUTH_SERVICE } from '@/features/auth';
import type { User, UserRole } from '@/entities/user';
import type { AuthResponse } from '@/features/auth/types/auth.types';

const schema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    role: yup.string().required('Role is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    phoneNumber: yup.string(),
    address: yup.string(),
    enabled: yup.boolean().default(true),
});

const roles = ['Manager', 'Staff', 'Vendor', 'Client'] as const;

export type UserFormFields = Omit<User, 'id' | 'createdAt' | 'password'>;

const AddUser = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { success, error } = useSnackbar();

    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'Manager',
        },
    });


    const { mutate, isPending } = useMutation({
        mutationFn: (data: User) => AUTH_SERVICE.register(data),
        onSuccess: (data: AuthResponse) => {
            success(data?.message || 'User added successfully!');
            navigate('/admin/users');
        },
        onError: (err: any) => {
            const apiErrors = err?.response?.data?.errors;
            const apiMessage = err?.response?.data?.message || 'Failed to add user. Please try again.';
            error(apiMessage);

            if (apiErrors && typeof apiErrors === 'object') {
                Object.entries(apiErrors).forEach(([field, message]) => {
                    setError(field as FieldPath<UserFormFields>, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        },
    });

    const onSubmit = (data: { role: string; name: string; email: string; password: string; phoneNumber?: string; address?: string; enabled: boolean }) => {
        mutate({ ...data, role: data.role as UserRole });
    };

    return (
        <Box sx={{ p: 0 }}>
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
                    Add User
                </Typography>

                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/admin/users"
                        onClick={(e) => { e.preventDefault(); navigate('/admin/users'); }}
                        sx={{ fontSize: '0.85rem', fontWeight: 500 }}
                    >
                        Users
                    </Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Add User
                    </Typography>
                </Breadcrumbs>
            </Box>

            <DashboardCard sx={{ p: 2 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
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
                                        placeholder="Enter user's full name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
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
                                        placeholder="example@wedspot.com"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
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
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#334155',
                                        mb: 0.75,
                                        display: 'block',
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
                                            InputProps={{ sx: { borderRadius: '10px', height: '42px', bgcolor: '#f8fafc' } }}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role} value={role}>{role}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Phone Number"
                                        placeholder="+91 1234567890"
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Address"
                                        placeholder="Enter Address"
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Set Password *"
                                        type="password"
                                        placeholder="Min 6 characters"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        InputProps={{ sx: { height: '42px' } }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', pb: '1px' }}>
                                <Controller
                                    name="enabled"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Switch {...field} checked={field.value} color="primary" />}
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
                                    onClick={() => navigate('/admin/users')}
                                    sx={{
                                        width: 'auto', minWidth: '100px', px: 3, height: '40px',
                                        fontSize: '0.9rem', py: 0, background: 'transparent',
                                        color: 'text.secondary', borderColor: '#e2e8f0', boxShadow: 'none',
                                        '&:hover': { background: '#f1f5f9', borderColor: '#cbd5e1', transform: 'none' }
                                    }}
                                >
                                    Cancel
                                </FormButton>

                                {/* ✅ isPending directly from useMutation — no extra state needed */}
                                <FormButton
                                    type="submit"
                                    loading={isPending}
                                    sx={{ width: 'auto', minWidth: '100px', px: 4, height: '40px', fontSize: '0.9rem', py: 0 }}
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

export default AddUser;
