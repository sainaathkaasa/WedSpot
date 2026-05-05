import { useEffect, type JSX } from "react";
import { Box } from "@mui/material";
import { CHAT_SERVICE } from "@/features/chat/api";
import { authStore } from "@/features/auth/utils/authSingleton";
import { useChatStore } from "@/features/chat/store";
import type { ChatMessage } from "@/features/chat/types";
import ChatContainer from "@/features/chat/components/ChatContainer";

const ChatbotPage = (): JSX.Element => {
    const { setMessages } = useChatStore();
    const currentUserEmail = authStore.getEmail();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await CHAT_SERVICE.GetHistory(1, 200);
                const mappedMessages: ChatMessage[] = (data.items || []).map((m: any) => ({
                    id: m.id || Math.random().toString(36).substr(2, 9),
                    userEmail: m.userEmail || 'Guest',
                    message: m.message,
                    createdAt: m.createdAt || new Date().toISOString(),
                    status: 'read',
                    isOwn: m.userEmail === currentUserEmail
                }));
                setMessages(mappedMessages);
            } catch (e) {
                console.error("failed to fetch history", e);
            }
        };
        fetchHistory();
    }, [currentUserEmail, setMessages]);

    return (
        <Box sx={{ p: 0, maxWidth: 1600, margin: "0 auto" }}>
            <ChatContainer />
        </Box>
    );
};

export default ChatbotPage;
