import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Avatar, Fab, alpha, useTheme, styled } from '@mui/material';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

// 1. Move static assets or styled components outside to prevent re-creation
const StyledOverlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    inset: 0,
    zIndex: theme.zIndex.modal + 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
}));

interface CallOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    callerName: string;
    callerAvatar?: string;
    isVideo?: boolean;
}

const CallOverlay: React.FC<CallOverlayProps> = ({
    isOpen,
    onClose,
    callerName,
    callerAvatar,
    isVideo = false
}) => {
    const theme = useTheme();
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [callTime, setCallTime] = useState(0);

    // 2. Optimized Timer Logic
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isOpen) {
            timer = setInterval(() => setCallTime(prev => prev + 1), 1000);
        }
        return () => {
            clearInterval(timer);
            if (!isOpen) setCallTime(0);
        };
    }, [isOpen]);

    // 3. Memoized formatters to prevent recalculation on every render
    const formattedTime = useMemo(() => {
        const mins = Math.floor(callTime / 60);
        const secs = callTime % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, [callTime]);

    // 4. Action Handlers
    const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
    const toggleCamera = useCallback(() => setIsCameraOff(prev => !prev), []);

    return (
        <Box>
            {isOpen && (
                <StyledOverlay
                    sx={{
                        background: isVideo
                            ? `linear-gradient(135deg, ${alpha('#000', 0.9)} 0%, ${alpha('#111', 0.95)} 100%)`
                            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.secondary.main, 0.95)} 100%)`,
                    }}
                >
                    {/* Pulsing Rings - Simplified CSS Animation */}
                    <Box sx={{ position: 'relative', mb: 4 }}>
                        {[1, 2].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: 160,
                                    height: 160,
                                    transform: 'translate(-50%, -50%)',
                                    borderRadius: '50%',
                                    border: `1px solid ${alpha('#fff', 0.4)}`,
                                    animation: `pulse ${2 + i}s infinite ease-out`,
                                    '@keyframes pulse': {
                                        '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.5 },
                                        '100%': { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 },
                                    }
                                }}
                            />
                        ))}
                        <Avatar
                            src={callerAvatar}
                            sx={{
                                width: 140,
                                height: 140,
                                border: '4px solid #fff',
                                boxShadow: theme.shadows[10],
                                fontSize: '3rem',
                                fontWeight: 900,
                                bgcolor: 'primary.dark',
                            }}
                        >
                            {callerName[0]}
                        </Avatar>
                    </Box>

                    <Box sx={{ textAlign: 'center', color: '#fff', mb: 10 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                            {callerName}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.8, letterSpacing: '0.1em' }}>
                            {callTime > 0 ? formattedTime : (isVideo ? 'STARTING VIDEO...' : 'CONNECTING...')}
                        </Typography>
                    </Box>

                    {/* Controls container */}
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <CallControl
                            active={isMuted}
                            onClick={toggleMute}
                            icon={isMuted ? <MicOff /> : <Mic />}
                        />

                        {isVideo && (
                            <CallControl
                                active={isCameraOff}
                                onClick={toggleCamera}
                                icon={isCameraOff ? <VideoOff /> : <Video />}
                            />
                        )}

                        <Fab
                            color="error"
                            size="large"
                            onClick={onClose}
                            sx={{ width: 72, height: 72 }}
                        >
                            <PhoneOff size={32} />
                        </Fab>
                    </Box>
                </StyledOverlay>
            )}
        </Box>
    );
};

// 5. Componentize sub-elements for cleaner JSX
const CallControl = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
    <Fab
        size="medium"
        onClick={onClick}
        sx={{
            bgcolor: active ? alpha('#fff', 0.2) : alpha('#fff', 0.1),
            color: '#fff',
            backdropFilter: 'blur(10px)',
            '&:hover': { bgcolor: alpha('#fff', 0.3) }
        }}
    >
        {icon}
    </Fab>
);

export default CallOverlay;