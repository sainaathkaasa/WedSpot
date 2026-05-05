import React from 'react';
import { Box, Typography, Avatar, IconButton, Divider, Grid, alpha, useTheme, Button } from '@mui/material';
import { X, Phone, Mail, FileText, Bell, Trash2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactInfoProps {
    onClose: () => void;
    contact: {
        name: string;
        avatar?: string;
        isOnline: boolean;
    };
}

const ContactInfo: React.FC<ContactInfoProps> = ({ onClose, contact }) => {
    const theme = useTheme();

    const sharedMedia = [
        { id: 1, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100&h=100&fit=crop' },
        { id: 2, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop' },
        { id: 3, url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=100&h=100&fit=crop' },
        { id: 4, icon: <FileText size={20} />, name: 'Quote_V2.pdf' },
    ];

    return (
        <Box
            component={motion.div}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            sx={{
                position: { xs: 'absolute', md: 'relative' },
                top: 0,
                right: 0,
                bottom: 0,
                width: { xs: '100%', md: 320 },
                height: '100%',
                zIndex: 1000,
                bgcolor: 'background.paper',
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Details</Typography>
                <IconButton onClick={onClose} size="small"><X size={20} /></IconButton>
            </Box>

            <Divider sx={{ opacity: 0.5 }} />

            {/* Profile Section */}
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                    src={contact.avatar}
                    sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 900,
                        border: `4px solid ${alpha(theme.palette.primary.main, 0.05)}`
                    }}
                >
                    {contact.name[0]}
                </Avatar>
                <Typography variant="h6">{contact.name}</Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ px: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '100%', bgcolor: alpha(theme.palette.divider, 0.05), color: 'text.secondary' }}>
                        <Phone size={18} />
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Mobile</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>+91 98765 43210</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '100%', bgcolor: alpha(theme.palette.divider, 0.05), color: 'text.secondary' }}>
                        <Mail size={18} />
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Email</Typography>
                        <Typography variant="body2" sx={{
                            fontWeight: 700,
                            wordBreak: 'break-all',
                            whiteSpace: 'normal',
                            maxWidth: "75%"
                        }}>
                            {contact.name.toLowerCase().replace(/\s+/g, '.')}@example.com
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            {/* Shared Media */}
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Shared Media</Typography>
                    <Button size="small" sx={{ fontSize: '11px', fontWeight: 700 }}>See All</Button>
                </Box>
                <Grid container spacing={1}>
                    {sharedMedia.map((item) => (
                        <Grid item xs={3} key={item.id}>
                            <Box sx={{
                                pt: '100%',
                                position: 'relative',
                                bgcolor: alpha(theme.palette.divider, 0.05),
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {item.url ? (
                                    <img src={item.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'primary.main' }}>
                                        {item.icon}
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Settings */}
            <Box sx={{ p: 3, mt: 'auto' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'text.disabled', textTransform: 'uppercase', fontSize: '10px' }}>Settings</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                        { icon: <Bell size={18} />, label: 'Mute Notifications', color: 'text.primary' },
                        { icon: <Shield size={18} />, label: 'Privacy Settings', color: 'text.primary' },
                        { icon: <Trash2 size={18} />, label: 'Delete Chat', color: 'error.main' },
                    ].map((item, idx) => (
                        <Button
                            key={idx}
                            fullWidth
                            startIcon={item.icon}
                            sx={{
                                justifyContent: 'flex-start',
                                color: item.color,
                                py: 1,
                                fontWeight: 700,
                                textTransform: 'none',
                                '&:hover': { bgcolor: alpha(theme.palette.divider, 0.03) }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default ContactInfo;
