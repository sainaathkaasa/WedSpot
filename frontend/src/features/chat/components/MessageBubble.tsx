import React from 'react';
import { Box, Typography, alpha, useTheme, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { type ChatMessage } from '../types';

interface MessageBubbleProps {
    message: ChatMessage;
    showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showAvatar = true }) => {
    const theme = useTheme();
    const isOwn = message.isOwn;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
                width: '100%'
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: isOwn ? 'row-reverse' : 'row', 
                gap: 1.5, 
                maxWidth: '85%' 
            }}>
                {showAvatar && !isOwn && (
                    <Avatar 
                        sx={{ 
                            width: 32, 
                            height: 32, 
                            fontSize: '0.8rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontWeight: 700,
                            mt: 0.5
                        }}
                    >
                        {message.userEmail[0].toUpperCase()}
                    </Avatar>
                )}
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                    <Box
                        sx={{
                            p: '10px 16px',
                            borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            bgcolor: isOwn ? theme.palette.primary.main : alpha(theme.palette.divider, 0.05),
                            color: isOwn ? '#fff' : 'text.primary',
                            boxShadow: isOwn ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                            border: isOwn ? 'none' : '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5 }}>
                            {message.message}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, px: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, fontSize: '10px' }}>
                            {dayjs(message.createdAt).format('h:mm A')}
                        </Typography>
                        {isOwn && (
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '10px' }}>
                                • {message.status.toUpperCase()}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

export default MessageBubble;
