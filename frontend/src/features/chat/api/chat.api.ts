import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";

export const CHAT_SERVICE = {
    GetHistory: async (page = 1, pageSize = 200) => {
        const response = await api.get(endpoints.ChatHistory, {
            params: { page, pageSize },
        });
        return response.data;
    },
};
