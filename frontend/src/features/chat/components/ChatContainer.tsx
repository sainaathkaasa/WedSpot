import React from 'react';
import { Box, alpha, useTheme, useMediaQuery } from '@mui/material';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useChat } from '@/features/chat/hooks/useChat';
import { useChatStore } from '@/features/chat/store/chatStore';
import { authStore } from '@/features/auth/utils/authSingleton';
import CallOverlay from './CallOverlay';
import ContactInfo from './ContactInfo';
import { AnimatePresence } from 'framer-motion';
import type { Conversation } from '../types/chat.types';

const ChatContainer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { sendMessage, sendTyping } = useChat();
    const { conversations, activeConversationId, initializeDefaultData } = useChatStore();

    // Initial Data Load
    React.useEffect(() => {
        const role = authStore.getRole();
        initializeDefaultData(role);
    }, [initializeDefaultData]);

    // Call & UI State
    const [isCallOpen, setIsCallOpen] = React.useState(false);
    const [isVideoCall, setIsVideoCall] = React.useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = React.useState(false);
    const [showMobileChat, setShowMobileChat] = React.useState(false);

    // Sync showMobileChat when activeConversationId changes on desktop/other means
    React.useEffect(() => {
        if (activeConversationId && isMobile) {
            setShowMobileChat(true);
        }
    }, [activeConversationId, isMobile]);

    const activeConv: Conversation = conversations.find((c: Conversation) => c.id === activeConversationId) || {
        id: 'default',
        name: 'Support Team',
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: 0,
        avatar: '',
        isOnline: true
    };

    const handleCall = (video: boolean = false) => {
        setIsVideoCall(video);
        setIsCallOpen(true);
    };

    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            height: { xs: 'calc(100vh - 140px)', md: 'calc(100vh - 120px)' },
            maxHeight: 900,
            bgcolor: 'background.paper',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.08)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.05)}`
        }}>
            {/* Sidebar Flow */}
            {(!isMobile || !showMobileChat) && (
                <Box sx={{ width: isMobile ? '100%' : 'auto', height: '100%' }}>
                    <ConversationList />
                </Box>
            )}

            {/* Chat Window Flow */}
            {(!isMobile || showMobileChat) && (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
                    <ChatHeader
                        onCall={() => handleCall(false)}
                        onVideo={() => handleCall(true)}
                        onInfo={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                        onBack={isMobile ? () => setShowMobileChat(false) : undefined}
                    />
                    <MessageList />
                    <ChatInput onSend={sendMessage} onTyping={sendTyping} />
                </Box>
            )}

            {/* Premium Info Panel */}
            <AnimatePresence>
                {isInfoPanelOpen && (
                    <ContactInfo
                        contact={{ name: activeConv.name, avatar: activeConv.avatar, isOnline: activeConv.isOnline }}
                        onClose={() => setIsInfoPanelOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Premium Call Overlay */}
            <CallOverlay
                isOpen={isCallOpen}
                onClose={() => setIsCallOpen(false)}
                callerName={activeConv.name}
                callerAvatar={activeConv.avatar}
                isVideo={isVideoCall}
            />
        </Box>
    );
};

export default ChatContainer;
