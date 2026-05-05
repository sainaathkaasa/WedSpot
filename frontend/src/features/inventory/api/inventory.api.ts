import api from "@/api/axios";

export const INVENTORY_API = {
    getAll: async () => {
        const response = await api.get("/inventory");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },
    create: async (params: { name: string; category: string; stock?: number; unit?: string }) => {
        const response = await api.post("/inventory", null, { params });
        return response.data;
    },
    update: async (id: number, params: { name?: string; stock?: number; status?: string }) => {
        const response = await api.put(`/inventory/${id}`, null, { params });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/inventory/${id}`);
        return response.data;
    },
};
