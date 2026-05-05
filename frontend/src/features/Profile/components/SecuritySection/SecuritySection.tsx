import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Alert,
    CircularProgress
} from "@mui/material";
import {
    Lock as LockIcon,
    Visibility as EyeIcon,
    VisibilityOff as EyeOffIcon,
    CheckCircle as CheckIcon
} from "@mui/icons-material";
import { USER_SERVICE } from "@/features/Users/api/user.api";
import { useUser } from "@/features/user";


const SecuritySection: React.FC = () => {
    const { user } = useUser();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleUpdate = async () => {
        setError(null);
        setSuccess(false);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            const response = await USER_SERVICE.changePassword(Number(user.id), currentPassword, newPassword);
            if (response.ok) {
                setSuccess(true);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError(response.message || "Failed to update password");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred while updating password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Password & Security</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Manage your security settings and password.</Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Password updated successfully!</Alert>}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', ml: 0.5, mb: 1, display: 'block' }}>CURRENT PASSWORD</Typography>
                    <TextField
                        fullWidth
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrent(!showCurrent)} size="small">
                                        {showCurrent ? <EyeOffIcon fontSize="small" /> : <EyeIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3 }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', ml: 0.5, mb: 1, display: 'block' }}>NEW PASSWORD</Typography>
                    <TextField
                        fullWidth
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNew(!showNew)} size="small">
                                        {showNew ? <EyeOffIcon fontSize="small" /> : <EyeIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3 }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', ml: 0.5, mb: 1, display: 'block' }}>CONFIRM NEW PASSWORD</Typography>
                    <TextField
                        fullWidth
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm(!showConfirm)} size="small">
                                        {showConfirm ? <EyeOffIcon fontSize="small" /> : <EyeIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3 }
                        }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={loading}
                    onClick={handleUpdate}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : success ? <CheckIcon /> : null}
                    sx={{ borderRadius: 3, px: 6, py: 1.5, fontWeight: 800 }}
                >
                    {loading ? "Updating..." : success ? "Updated" : "Update Password"}
                </Button>
            </Box>
        </Box>
    );
};

export default SecuritySection;
