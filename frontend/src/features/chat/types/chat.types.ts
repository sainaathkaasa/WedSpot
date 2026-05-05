export interface ChatMessage {
    id: string;
    conversationId: string;
    userEmail: string;
    message: string;
    createdAt: string;
    status: 'sent' | 'delivered' | 'read';
    isOwn: boolean;
}

export interface Conversation {
    id: string;
    name: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    avatar?: string;
    isOnline: boolean;
}

export interface AiMessage {
    role: 'user' | 'assistant';
    content: string;
}
