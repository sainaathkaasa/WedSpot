import { create } from 'zustand';
import { HubConnection } from '@microsoft/signalr';
import type { ChatMessage, Conversation } from '../types';

interface ChatState {
    messages: ChatMessage[];
    conversations: Conversation[];
    activeConversationId: string | null;
    connection: HubConnection | null;
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    typingUsers: Set<string>;
    
    // Actions
    setConnection: (connection: HubConnection | null) => void;
    setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void;
    addMessage: (message: ChatMessage) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (id: string | null) => void;
    addTypingUser: (userEmail: string) => void;
    removeTypingUser: (userEmail: string) => void;
    updatePresence: (userEmail: string, isOnline: boolean) => void;
    initializeDefaultData: (role: string | null) => void;
}

const MOCK_DATA: Record<string, { conversations: Conversation[], messages: ChatMessage[] }> = {
    'Super Admin': {
        conversations: [
            { id: '1', name: 'System Support', lastMessage: 'Monitoring alerts are set.', lastMessageTime: '10:30 AM', unreadCount: 0, isOnline: true },
            { id: '2', name: 'Staff: Sarah (Manager)', lastMessage: 'Monthly reports are ready.', lastMessageTime: '9:15 AM', unreadCount: 1, isOnline: true },
            { id: '3', name: 'Vendor: Royal Banquet', lastMessage: 'New booking inquiry.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: false },
            { id: '4', name: 'Client: Priya Sharma', lastMessage: 'Updated the mood board.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
            { id: '5', name: 'Staff: John Doe', lastMessage: 'Uniforms distributed.', lastMessageTime: '08:00 AM', unreadCount: 0, isOnline: true },
            { id: '6', name: 'Vendor: Floral Dreams', lastMessage: 'Inventory updated.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: true },
        ],
        messages: [
            { id: 'sa1', conversationId: '1', userEmail: 'system@weddingcraft.com', message: 'Daily system health check: All servers green.', createdAt: new Date(Date.now() - 36000000).toISOString(), status: 'read', isOwn: false },
            { id: 'sa2', conversationId: '1', userEmail: 'admin@weddingcraft.com', message: 'Acknowledged. Any updates on the database migration?', createdAt: new Date(Date.now() - 35000000).toISOString(), status: 'read', isOwn: true },
            { id: 'sa3', conversationId: '1', userEmail: 'system@weddingcraft.com', message: 'Migration scheduled for 2 AM tonight.', createdAt: new Date(Date.now() - 34000000).toISOString(), status: 'read', isOwn: false },
            { id: 'sa4', conversationId: '1', userEmail: 'admin@weddingcraft.com', message: 'Perfect. Keep me posted.', createdAt: new Date(Date.now() - 33000000).toISOString(), status: 'read', isOwn: true },
            { id: 'sa5', conversationId: '1', userEmail: 'system@weddingcraft.com', message: 'Will do. All monitoring alerts are set.', createdAt: new Date(Date.now() - 32000000).toISOString(), status: 'read', isOwn: false },
            
            { id: 'sa6', conversationId: '2', userEmail: 'sarah@weddingcraft.com', message: 'Hi Admin, I have finalized the staff assignments for the upcoming gala.', createdAt: new Date(Date.now() - 26000000).toISOString(), status: 'read', isOwn: false },
            { id: 'sa7', conversationId: '2', userEmail: 'admin@weddingcraft.com', message: 'Great, can you send the PDF?', createdAt: new Date(Date.now() - 25000000).toISOString(), status: 'read', isOwn: true },
            { id: 'sa8', conversationId: '2', userEmail: 'sarah@weddingcraft.com', message: 'Uploading it now.', createdAt: new Date(Date.now() - 24000000).toISOString(), status: 'read', isOwn: false },
            { id: 'sa9', conversationId: '2', userEmail: 'admin@weddingcraft.com', message: 'Received. Please also check regarding the temporary staff.', createdAt: new Date(Date.now() - 23000000).toISOString(), status: 'read', isOwn: true },
            { id: 'sa10', conversationId: '2', userEmail: 'sarah@weddingcraft.com', message: 'Will do! Monthly reports are ready as well.', createdAt: new Date(Date.now() - 22000000).toISOString(), status: 'read', isOwn: false },
            
            { id: 'sa11', conversationId: '5', userEmail: 'john@weddingcraft.com', message: 'Staff shirts have arrived at the warehouse.', createdAt: new Date(Date.now() - 10000000).toISOString(), status: 'read', isOwn: false },
            { id: 'sa12', conversationId: '5', userEmail: 'admin@weddingcraft.com', message: 'Excellent. Please coordinate the distribution.', createdAt: new Date(Date.now() - 9000000).toISOString(), status: 'read', isOwn: true },
            { id: 'sa13', conversationId: '5', userEmail: 'john@weddingcraft.com', message: 'The gala team has already received theirs.', createdAt: new Date(Date.now() - 8000000).toISOString(), status: 'read', isOwn: false },
            { id: 'sa14', conversationId: '5', userEmail: 'admin@weddingcraft.com', message: 'Tag the remaining boxes for the weekend event.', createdAt: new Date(Date.now() - 7000000).toISOString(), status: 'read', isOwn: true },
            { id: 'sa15', conversationId: '5', userEmail: 'john@weddingcraft.com', message: 'Uniforms distributed.', createdAt: new Date(Date.now() - 6000000).toISOString(), status: 'read', isOwn: false },
        ]
    },
    'Manager': {
        conversations: [
            { id: '1', name: 'Super Admin', lastMessage: 'Excellent. Looking forward to the results.', lastMessageTime: '11:00 AM', unreadCount: 1, isOnline: true },
            { id: '2', name: 'Staff: John Doe', lastMessage: 'On-site at the venue.', lastMessageTime: '10:45 AM', unreadCount: 0, isOnline: true },
            { id: '3', name: 'Vendor: Floral Dreams', lastMessage: 'Revised quote attached.', lastMessageTime: '09:30 AM', unreadCount: 0, isOnline: true },
            { id: '4', name: 'Client: Priya Sharma', lastMessage: 'Ready for walkthrough.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: true },
            { id: '5', name: 'Staff: Emily Chen', lastMessage: 'Schedule confirmed.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
            { id: '6', name: 'Vendor: Royal Banquet', lastMessage: 'Hall prep starting.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: false },
        ],
        messages: [
            { id: 'm1', conversationId: '1', userEmail: 'admin@weddingcraft.com', message: 'Sarah, please check the monthly KPIs for the venue department.', createdAt: new Date(Date.now() - 10000000).toISOString(), status: 'read', isOwn: false },
            { id: 'm2', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'On it. I noticed a small dip in catering efficiency.', createdAt: new Date(Date.now() - 9000000).toISOString(), status: 'read', isOwn: true },
            { id: 'm3', conversationId: '1', userEmail: 'admin@weddingcraft.com', message: 'Let\'s address that in our Monday meeting.', createdAt: new Date(Date.now() - 8000000).toISOString(), status: 'read', isOwn: false },
            { id: 'm4', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'Agreed. I\'m also reviewing the new staff list.', createdAt: new Date(Date.now() - 7000000).toISOString(), status: 'read', isOwn: true },
            { id: 'm5', conversationId: '1', userEmail: 'admin@weddingcraft.com', message: 'Excellent. Looking forward to the results.', createdAt: new Date(Date.now() - 6000000).toISOString(), status: 'read', isOwn: false },
            
            { id: 'm11', conversationId: '4', userEmail: 'priya@gmail.com', message: 'Hi Sarah, are we still meeting tomorrow for the final walkthrough?', createdAt: new Date(Date.now() - 15000000).toISOString(), status: 'read', isOwn: false },
            { id: 'm12', conversationId: '4', userEmail: 'sarah@weddingcraft.com', message: 'Yes! 2 PM at the Royal Hall.', createdAt: new Date(Date.now() - 14000000).toISOString(), status: 'read', isOwn: true },
            { id: 'm13', conversationId: '4', userEmail: 'priya@gmail.com', message: 'Should I bring my planner?', createdAt: new Date(Date.now() - 13000000).toISOString(), status: 'read', isOwn: false },
            { id: 'm14', conversationId: '4', userEmail: 'sarah@weddingcraft.com', message: 'Yes, and the updated guest count.', createdAt: new Date(Date.now() - 12000000).toISOString(), status: 'read', isOwn: true },
            { id: 'm15', conversationId: '4', userEmail: 'priya@gmail.com', message: 'Ready for walkthrough.', createdAt: new Date(Date.now() - 11000000).toISOString(), status: 'read', isOwn: false },
        ]
    },
    'Vendor': {
        conversations: [
            { id: '1', name: 'Super Admin Support', lastMessage: 'Your payout has been processed.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: true },
            { id: '2', name: 'Client: Priya Sharma', lastMessage: 'Inventory check for extra spots.', lastMessageTime: '10:00 AM', unreadCount: 2, isOnline: true },
            { id: '3', name: 'Manager: Sarah Jones', lastMessage: 'Venue walkthrough scheduled.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: false },
            { id: '4', name: 'Client: Anita Rao', lastMessage: 'New menu request.', lastMessageTime: '09:00 AM', unreadCount: 0, isOnline: true },
            { id: '5', name: 'Vendor Partner: Photo Pros', lastMessage: 'Equipment list sent.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
            { id: '6', name: 'Staff: John Doe', lastMessage: 'Ready for loading duty.', lastMessageTime: '08:30 AM', unreadCount: 0, isOnline: true },
        ],
        messages: [
            { id: 'v1', conversationId: '1', userEmail: 'support@weddingcraft.com', message: 'Invoice #4521 has been approved.', createdAt: new Date(Date.now() - 40000000).toISOString(), status: 'read', isOwn: false },
            { id: 'v2', conversationId: '1', userEmail: 'vendor@royal.com', message: 'Thank you! When will the transfer happen?', createdAt: new Date(Date.now() - 39000000).toISOString(), status: 'read', isOwn: true },
            { id: 'v3', conversationId: '1', userEmail: 'support@weddingcraft.com', message: 'It should hit your account within 24 hours.', createdAt: new Date(Date.now() - 38000000).toISOString(), status: 'read', isOwn: false },
            { id: 'v4', conversationId: '1', userEmail: 'vendor@royal.com', message: 'Greatly appreciated.', createdAt: new Date(Date.now() - 37000000).toISOString(), status: 'read', isOwn: true },
            { id: 'v5', conversationId: '1', userEmail: 'support@weddingcraft.com', message: 'Your payout has been processed.', createdAt: new Date(Date.now() - 36000000).toISOString(), status: 'read', isOwn: false },
            
            { id: 'v11', conversationId: '4', userEmail: 'anita@gmail.com', message: 'Hello! We want to update the appetizer menu.', createdAt: new Date(Date.now() - 5000000).toISOString(), status: 'read', isOwn: false },
            { id: 'v12', conversationId: '4', userEmail: 'vendor@royal.com', message: 'Sure, we have three new options available.', createdAt: new Date(Date.now() - 4000000).toISOString(), status: 'read', isOwn: true },
            { id: 'v13', conversationId: '4', userEmail: 'anita@gmail.com', message: 'Can you send the pricing for the seafood platter?', createdAt: new Date(Date.now() - 3000000).toISOString(), status: 'read', isOwn: false },
            { id: 'v14', conversationId: '4', userEmail: 'vendor@royal.com', message: 'Sending the full seasonal brochure now.', createdAt: new Date(Date.now() - 2000000).toISOString(), status: 'read', isOwn: true },
            { id: 'v15', conversationId: '4', userEmail: 'anita@gmail.com', message: 'New menu request.', createdAt: new Date(Date.now() - 1000000).toISOString(), status: 'read', isOwn: false },
        ]
    },
    'Staff': {
        conversations: [
            { id: '1', name: 'Manager: Sarah Jones', lastMessage: 'Hi lead, you are assigned to the Royal Banquet event.', lastMessageTime: '08:00 AM', unreadCount: 1, isOnline: true },
            { id: '2', name: 'Staff: John Doe', lastMessage: 'Running 5 mins late.', lastMessageTime: '07:45 AM', unreadCount: 0, isOnline: true },
            { id: '3', name: 'Super Admin Support', lastMessage: 'Your schedule for April is live.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: true },
            { id: '4', name: 'Staff: Emily Chen', lastMessage: 'Uniform picked up.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
            { id: '5', name: 'Manager: David Smith', lastMessage: 'Shift change approved.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: true },
            { id: '6', name: 'Client: Priya Sharma', lastMessage: 'Quick question about hall 2.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: false },
        ],
        messages: [
            { id: 's1', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'Hi team, check the new staff briefing for the Royal event.', createdAt: new Date(Date.now() - 20000000).toISOString(), status: 'read', isOwn: false },
            { id: 's2', conversationId: '1', userEmail: 'staff@weddingcraft.com', message: 'Received. What time should we arrive?', createdAt: new Date(Date.now() - 19000000).toISOString(), status: 'read', isOwn: true },
            { id: 's3', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'Be there by 10 AM sharp.', createdAt: new Date(Date.now() - 18000000).toISOString(), status: 'read', isOwn: false },
            { id: 's4', conversationId: '1', userEmail: 'staff@weddingcraft.com', message: 'Copy that. I\'ll bring the uniforms.', createdAt: new Date(Date.now() - 17000000).toISOString(), status: 'read', isOwn: true },
            { id: 's5', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'Hi lead, you are assigned to the Royal Banquet event.', createdAt: new Date(Date.now() - 16000000).toISOString(), status: 'read', isOwn: false },
            
            { id: 's11', conversationId: '5', userEmail: 'staff@weddingcraft.com', message: 'Hi David, can I swap my Friday shift?', createdAt: new Date(Date.now() - 25000000).toISOString(), status: 'read', isOwn: true },
            { id: 's12', conversationId: '5', userEmail: 'david@weddingcraft.com', message: 'Which day are you looking for?', createdAt: new Date(Date.now() - 24000000).toISOString(), status: 'read', isOwn: false },
            { id: 's13', conversationId: '5', userEmail: 'staff@weddingcraft.com', message: 'Saturday morning would be better.', createdAt: new Date(Date.now() - 23000000).toISOString(), status: 'read', isOwn: true },
            { id: 's14', conversationId: '5', userEmail: 'david@weddingcraft.com', message: 'Let me check the roster... Yes, that works.', createdAt: new Date(Date.now() - 22000000).toISOString(), status: 'read', isOwn: false },
            { id: 's15', conversationId: '5', userEmail: 'staff@weddingcraft.com', message: 'Shift change approved.', createdAt: new Date(Date.now() - 21000000).toISOString(), status: 'read', isOwn: true },
        ]
    },
    'Client': {
        conversations: [
            { id: '1', name: 'Wedding Planner (Sarah)', lastMessage: 'We booked the caterer! Checking contract now.', lastMessageTime: '11:15 AM', unreadCount: 1, isOnline: true },
            { id: '2', name: 'Vendor: Royal Banquet', lastMessage: 'Contract signed. We look forward to hosting you.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: false },
            { id: '3', name: 'Super Admin Support', lastMessage: 'How is your planning going? Let us know if you need anything.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
            { id: '4', name: 'Vendor: Floral Dreams', lastMessage: 'Mood board for centerpieces.', lastMessageTime: 'Yesterday', unreadCount: 0, isOnline: true },
            { id: '5', name: 'Vendor: Photo Pros', lastMessage: 'Engagement session booked.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
            { id: '6', name: 'Assistant Planner (John)', lastMessage: 'Vendor list confirmed.', lastMessageTime: 'Monday', unreadCount: 0, isOnline: true },
        ],
        messages: [
            { id: 'c1', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'Priya, I have an update on the catering options.', createdAt: new Date(Date.now() - 10000000).toISOString(), status: 'read', isOwn: false },
            { id: 'c2', conversationId: '1', userEmail: 'priya@gmail.com', message: 'Great! Which one did they confirm?', createdAt: new Date(Date.now() - 9000000).toISOString(), status: 'read', isOwn: true },
            { id: 'c3', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'Gourmet Delights is available for May 15th.', createdAt: new Date(Date.now() - 8000000).toISOString(), status: 'read', isOwn: false },
            { id: 'c4', conversationId: '1', userEmail: 'priya@gmail.com', message: 'That\'s fantastic, they were my top choice.', createdAt: new Date(Date.now() - 7000000).toISOString(), status: 'read', isOwn: true },
            { id: 'c5', conversationId: '1', userEmail: 'sarah@weddingcraft.com', message: 'We booked the caterer! Checking contract now.', createdAt: new Date(Date.now() - 6000000).toISOString(), status: 'read', isOwn: false },
            
            { id: 'c11', conversationId: '4', userEmail: 'flowers@dreams.com', message: 'Hi Priya, I have some ideas for the orchids.', createdAt: new Date(Date.now() - 5000000).toISOString(), status: 'read', isOwn: false },
            { id: 'c12', conversationId: '4', userEmail: 'priya@gmail.com', message: 'Can we mix them with white roses?', createdAt: new Date(Date.now() - 4000000).toISOString(), status: 'read', isOwn: true },
            { id: 'c13', conversationId: '4', userEmail: 'flowers@dreams.com', message: 'Absolutely, that would look very elegant.', createdAt: new Date(Date.now() - 3000000).toISOString(), status: 'read', isOwn: false },
            { id: 'c14', conversationId: '4', userEmail: 'priya@gmail.com', message: 'I sent some inspiration photos to your email.', createdAt: new Date(Date.now() - 2000000).toISOString(), status: 'read', isOwn: true },
            { id: 'c15', conversationId: '4', userEmail: 'flowers@dreams.com', message: 'Mood board for centerpieces.', createdAt: new Date(Date.now() - 1000000).toISOString(), status: 'read', isOwn: false },
        ]
    }
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    conversations: [],
    activeConversationId: null,
    connection: null,
    connectionStatus: 'disconnected',
    typingUsers: new Set(),

    setConnection: (connection) => set({ connection }),
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    
    addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
    })),
    
    setMessages: (messages) => set({ messages }),
    setConversations: (conversations) => set({ conversations }),
    setActiveConversation: (id) => set({ activeConversationId: id }),
    
    addTypingUser: (userEmail) => set((state) => {
        const newSet = new Set(state.typingUsers);
        newSet.add(userEmail);
        return { typingUsers: newSet };
    }),
    
    removeTypingUser: (userEmail) => set((state) => {
        const newSet = new Set(state.typingUsers);
        newSet.delete(userEmail);
        return { typingUsers: newSet };
    }),

    updatePresence: (userEmail, isOnline) => set((state) => ({
        conversations: state.conversations.map(c => 
            c.name === userEmail ? { ...c, isOnline } : c
        )
    })),

    initializeDefaultData: (role) => set(() => {
        const data = MOCK_DATA[role as keyof typeof MOCK_DATA] || MOCK_DATA['Client'];
        return {
            conversations: data.conversations,
            messages: data.messages,
            activeConversationId: data.conversations[0]?.id || null
        };
    })
}));
