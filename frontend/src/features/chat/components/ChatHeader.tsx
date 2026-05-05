import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Badge,
    alpha,
    useTheme,
    Tooltip,
    InputBase,
    Fade
} from '@mui/material';
import { Phone, Video, Info, Search, X, ChevronLeft } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

// 1. Define strict types for your data structures
interface Conversation {
    id: string;
    name: string;
    isOnline: boolean;
    avatar?: string;
    lastSeen?: string;
}

interface ChatHeaderProps {
    onCall: () => void;
    onVideo: () => void;
    onInfo: () => void;
    onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onCall, onVideo, onInfo, onBack }) => {
    const theme = useTheme();
    const { conversations, activeConversationId } = useChatStore();
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // 2. Memoize the active conversation lookup to avoid re-calculating on every render
    const activeConv: Conversation = useMemo(() => {
        return conversations.find((c: Conversation) => c.id === activeConversationId) || {
            id: "1",
            name: 'Support Team',
            isOnline: true,
            avatar: '',
            lastSeen: 'Monday'
        };
    }, [conversations, activeConversationId]);

    const handleCloseSearch = () => {
        setIsSearching(false);
        setSearchQuery('');
    };

    return (
        <Box sx={{
            p: { xs: 1, sm: 2 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            height: '75px',
            position: 'relative',
        }}>

            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                {!isSearching ? (
                    <Fade in={!isSearching}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                            {onBack && (
                                <IconButton
                                    onClick={onBack}
                                    size="small"
                                    sx={{ display: { xs: 'flex', md: 'none' }, mr: 0.5 }}
                                >
                                    <ChevronLeft size={20} />
                                </IconButton>
                            )}
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                color={activeConv.isOnline ? "success" : "default"}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        width: 12, height: 12,
                                        borderRadius: '50%',
                                        border: `2px solid ${theme.palette.background.paper}`
                                    }
                                }}
                            >
                                <Avatar
                                    src={activeConv.avatar}
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: 'primary.main',
                                        fontWeight: 700,
                                        width: 40, height: 40
                                    }}
                                >
                                    {activeConv.name[0]}
                                </Avatar>
                            </Badge>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                    {activeConv.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: activeConv.isOnline ? 'success.main' : 'text.disabled', fontWeight: 600 }}>
                                    {activeConv.isOnline ? 'Online now' : `Last seen ${activeConv?.lastSeen}`}
                                </Typography>
                            </Box>
                        </Box>
                    </Fade>
                ) : (
                    <Fade in={isSearching}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: alpha(theme.palette.action.hover, 0.05),
                            borderRadius: '12px',
                            px: 1.5,
                            py: 0.5,
                            width: '100%',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}>
                            <Search size={18} color={theme.palette.text.disabled} />
                            <InputBase
                                autoFocus
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ ml: 1, flex: 1, fontSize: 12 }}
                            />
                            <IconButton size="small" onClick={handleCloseSearch}>
                                <X size={16} />
                            </IconButton>
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* 4. Action Buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                {!isSearching && (
                    <>
                        <Tooltip title="Audio Call">
                            <IconButton onClick={onCall} size="small" color="primary">
                                <Phone size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Video Call">
                            <IconButton onClick={onVideo} size="small" color="primary">
                                <Video size={18} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
                <Tooltip title="Search">
                    <IconButton
                        onClick={() => setIsSearching(true)}
                        size="small"
                        sx={{ color: isSearching ? 'primary.main' : 'text.secondary' }}
                    >
                        <Search size={18} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Details">
                    <IconButton onClick={onInfo} size="small" sx={{ color: 'text.secondary' }}>
                        <Info size={18} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ChatHeader;