import React from "react";
import {
    Box,
    Typography,
    IconButton,
    Divider,
    useTheme,
} from "@mui/material";
import {
    CameraAlt as CameraIcon,
    Email as EmailIcon,
    LocationOn as PinIcon,
    VerifiedUser as ShieldCheckIcon,
    CalendarMonth as CalendarIcon,
    Logout as LogoutIcon
} from "@mui/icons-material";
import { getInitials } from "@/utils/userUtils";
import { DashboardCard } from '@/features/dashboard';
import { useAuth } from "@/features/auth";
import type { InfoItemProps, ProfileSidebarHeaderProps } from "../../types/ProfileSidebarHeader.types";
import { ProfileAvatar, LogoutButton, InfoIconWrapper } from "./ProfileSidebarHeader.styles";
import { useUser } from "@/features/user";

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, colorType = 'primary' }) => {
    const theme = useTheme();
    const mainColor = (theme.palette as any)[colorType]?.main || theme.palette.primary.main;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InfoIconWrapper $color={mainColor}>
                {icon}
            </InfoIconWrapper>
            <Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600, lineHeight: 1 }}>{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{value}</Typography>
            </Box>
        </Box>
    );
};

const ProfileSidebarHeader: React.FC<ProfileSidebarHeaderProps> = ({ name, role, email, address }) => {
    const theme = useTheme();
    const { logout } = useAuth();

    const onLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <DashboardCard noPadding sx={{ height: '100%', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, pb: 4, textAlign: 'center', mt: 2, position: 'relative', zIndex: 1, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 3, alignSelf: 'center' }}>
                        <ProfileAvatar>
                            {getInitials(name || role || "")}
                        </ProfileAvatar>
                        <IconButton
                            size="small"
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                boxShadow: theme.shadows[4],
                                border: `2px solid ${theme.palette.background.paper}`,
                                '&:hover': { bgcolor: theme.palette.primary.dark },
                                transition: '0.2s'
                            }}
                        >
                            <CameraIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}>
                        {name || 'User'}
                    </Typography>

                    <Divider sx={{ mb: 4, mx: -3 }} />

                    <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <InfoItem icon={<EmailIcon fontSize="small" />} label="Email" value={email || "No email provided"} />
                        <InfoItem icon={<PinIcon fontSize="small" />} label="Address" value={address || "No address provided"} />
                        <InfoItem icon={<ShieldCheckIcon fontSize="small" />} label="Status" value="Verified Account" colorType="success" />
                        <InfoItem icon={<CalendarIcon fontSize="small" />} label="Role" value={role || "Client"} />
                    </Box>

                    <Divider sx={{ my: 4, mx: -3 }} />

                    <LogoutButton
                        variant="outlined"
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={onLogout}
                    >
                        Sign Out
                    </LogoutButton>
                </Box>
            </Box>
        </DashboardCard>
    );
};

export default ProfileSidebarHeader;
