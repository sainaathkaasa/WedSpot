import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";

export const INVENTORY_API = {
    getAll: async () => {
        const response = await api.get(endpoints.Inventory);
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`${endpoints.Inventory}/${id}`);
        return response.data;
    },
    create: async (params: { name: string; category: string; stock?: number; unit?: string }) => {
        const response = await api.post(endpoints.Inventory, null, { params });
        return response.data;
    },
    update: async (id: number, params: { name?: string; stock?: number; status?: string }) => {
        const response = await api.put(`${endpoints.Inventory}/${id}`, null, { params });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`${endpoints.Inventory}/${id}`);
        return response.data;
    },
};
