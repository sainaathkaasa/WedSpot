import api from "./axios";
import endpoints from "./ApiEndpoints";

export const HEALTH_SERVICE = {
    check: async () => {
        try {
            const response = await api.get(endpoints.Health);
            return response.data;
        } catch (error) {
            console.error("Health check failed", error);
            throw error;
        }
    }
};
