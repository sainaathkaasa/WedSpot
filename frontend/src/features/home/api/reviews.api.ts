import api from "@/api/axios";

export const REVIEWS_API = {
    getAll: async () => {
        const response = await api.get("/reviews");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/reviews/${id}`);
        return response.data;
    },
    getByServiceId: async (serviceId: number) => {
        const response = await api.get(`/reviews/service/${serviceId}`);
        return response.data;
    },
    create: async (data: { serviceId: number; rating: number; comment?: string }) => {
        const response = await api.post("/reviews", data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    },
};
