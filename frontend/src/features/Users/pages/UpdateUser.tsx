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
    Link,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, type FieldPath } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DashboardCard } from '@/features/dashboard';
import { InputField } from '@/components/UI/Form';
import { FormButton } from '@/components/UI/Button';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import type { APIResponse } from '@/api/types';
import type { User, UserRole } from '@/entities/user';
import type { UserFormFields } from '@/features/Users/pages/AddUser';
import { USER_SERVICE } from "@/features/Users/api/user.api";

const schema = yup.object().shape({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    role: yup.string().required('Role is required'),
    phoneNumber: yup.string(),
    address: yup.string(),
    enabled: yup.boolean().default(true),
});

const roles = ['Manager', 'Staff', 'Vendor', 'Client'] as const;

const UpdateUser = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { success, error } = useSnackbar();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            role: 'Manager',
        },
    });

    const { data, isLoading: isFetching, isSuccess, isError, error: queryError } = useQuery({
        queryKey: ['user', id],
        queryFn: () => USER_SERVICE.getUserById(Number(id)!),
        enabled: !!id,
    });

    // Handle Success: Reset the form when data arrives
    useEffect(() => {
        if (isSuccess && data) {
            console.log("Incoming data: ", data?.data);
            reset(data?.data);
        }
    }, [isSuccess, data, reset]);

    // Handle Error: Navigate away or show snackbar
    useEffect(() => {
        if (isError) {
            const err = queryError as any;
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to load user data.';

            error(errorMessage); // Assuming this is your snackbar/toast function
            navigate('/admin/users');
        }
    }, [isError, queryError, navigate, error]);

    const { mutate: updateUser, isPending: isUpdating } = useMutation({
        mutationFn: (data: User) => USER_SERVICE.updateProfile(Number(id)!, data),
        onSuccess: (data: APIResponse) => {
            success(data?.message || 'User updated successfully!');
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

    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
        mutationFn: () => USER_SERVICE.deleteUserById(Number(id)!),
        onSuccess: () => {
            success('User deleted successfully!');
            navigate('/admin/users');
        },
        onError: (err: any) => {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to delete user. Please try again.';
            error(errorMessage);
            setDeleteDialogOpen(false);
        },
    });

    const onSubmit = (data: { role: string; name: string; email: string; phoneNumber?: string; address?: string; enabled: boolean; password?: string }) => {
        const { password, ...rest } = data;
        const payload = password ? { ...rest, role: rest.role as UserRole, password } : { ...rest, role: rest.role as UserRole };
        updateUser(payload);
    };

    if (isFetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        );
    }

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
                    Update User
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
                        Update User
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
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Phone Number"
                                        placeholder="Enter phone number"
                                        // error={!!errors.phone}
                                        // helperText={errors.phone}
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
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <InputField
                                        {...field}
                                        label="Address"
                                        placeholder="Enter user's full name"
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
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
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* ✅ Delete on the left, actions on the right */}
                                <FormButton
                                    variant="outlined"
                                    onClick={() => setDeleteDialogOpen(true)}
                                    loading={isDeleting}
                                    startIcon={<DeleteIcon />}
                                    sx={{
                                        width: 'auto', minWidth: '100px', px: 3, height: '40px',
                                        fontSize: '0.9rem', py: 0, background: 'transparent',
                                        color: 'error.main', borderColor: 'error.light', boxShadow: 'none',
                                        '&:hover': { background: '#fff1f1', borderColor: 'error.main', transform: 'none' }
                                    }}
                                >
                                    Delete
                                </FormButton>

                                <Box sx={{ display: 'flex', gap: 2 }}>
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

                                    <FormButton
                                        type="submit"
                                        loading={isUpdating}
                                        sx={{ width: 'auto', minWidth: '100px', px: 4, height: '40px', fontSize: '0.9rem', py: 0 }}
                                    >
                                        Update
                                    </FormButton>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DashboardCard>

            {/* ✅ Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete User?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action is permanent and cannot be undone. Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        disabled={isDeleting}
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => deleteUser()}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                        sx={{ borderRadius: '8px', textTransform: 'none', minWidth: '80px' }}
                    >
                        {isDeleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UpdateUser;
