import { useEffect, useCallback } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useChatStore } from '../store';
import type { ChatMessage } from '../types';
import { authStore } from '../../auth/utils/authSingleton';

const HUB_URL = (import.meta.env.VITE_API_BASE || "http://localhost:5000") + "/hubs/chat";

export const useChat = () => {
    const { 
        connection, 
        setConnection, 
        setConnectionStatus, 
        addMessage, 
        addTypingUser, 
        removeTypingUser,
        updatePresence,
        activeConversationId 
    } = useChatStore();

    const currentUserEmail = authStore.getEmail(); 

    useEffect(() => {
        let isMounted = true;
        let retryTimeout: any;

        if (connection) return;

        const token = authStore.getAccessToken();
        const newConnection = new HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token ?? "",
                withCredentials: true,
            })
            .configureLogging(LogLevel.None) // Silent logging to prevent spam
            .withAutomaticReconnect()
            .build();

        // Listeners
        newConnection.on("ReceiveMessage", (payload: any) => {
            if (!isMounted) return;
            const message: ChatMessage = {
                id: payload.id || Math.random().toString(36).substr(2, 9),
                conversationId: payload.conversationId || activeConversationId || '1',
                userEmail: payload.userEmail || 'Guest',
                message: payload.message,
                createdAt: payload.createdAt || new Date().toISOString(),
                status: 'read',
                isOwn: payload.userEmail === currentUserEmail
            };
            addMessage(message);
        });

        newConnection.on("UserTyping", (userEmail: string) => {
            if (!isMounted) return;
            if (userEmail !== currentUserEmail) {
                addTypingUser(userEmail);
                setTimeout(() => removeTypingUser(userEmail), 3000);
            }
        });

        newConnection.on("UserPresence", (userEmail: string, isOnline: boolean) => {
            if (!isMounted) return;
            updatePresence(userEmail, isOnline);
        });

        const startConnection = async () => {
            if (newConnection.state !== "Disconnected") return;
            
            try {
                setConnectionStatus('connecting');
                await newConnection.start();
                if (isMounted) {
                    setConnection(newConnection);
                    setConnectionStatus('connected');
                    console.log("Chat system online.");
                }
            } catch (err) {
                if (isMounted) {
                    setConnectionStatus('disconnected');
                    // Reduced logging to one line instead of full stack trace
                    console.warn(`Chat server unreachable (retrying in 10s)...`);
                    retryTimeout = setTimeout(startConnection, 10000);
                }
            }
        };

        startConnection();

        return () => {
            isMounted = false;
            if (retryTimeout) clearTimeout(retryTimeout);
            newConnection.stop().catch(() => {});
            setConnection(null);
            setConnectionStatus('disconnected');
        };
    }, [currentUserEmail, activeConversationId]); 

    const sendMessage = useCallback(async (text: string) => {
        if (connection && text.trim()) {
            try {
                await connection.invoke("SendMessage", text, activeConversationId);
            } catch (err) {
                console.error("SendMessage Error: ", err);
            }
        }
    }, [connection, activeConversationId]);

    const sendTyping = useCallback(async () => {
        if (connection) {
            try {
                await connection.invoke("SendTyping");
            } catch (err) {
                // Ignore typing errors to avoid noise
            }
        }
    }, [connection]);

    return { sendMessage, sendTyping };
};
