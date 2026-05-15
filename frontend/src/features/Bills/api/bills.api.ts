import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";

export const BILLS_API = {
    getAll: async () => {
        const response = await api.get(endpoints.Bills);
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`${endpoints.Bills}/${id}`);
        return response.data;
    },
    getByClient: async (clientId: number) => {
        const response = await api.get(`${endpoints.Bills}/client/${clientId}`);
        return response.data;
    },
    create: async (params: { invoiceNumber: string; clientId: number; amount: number; date: string }) => {
        const response = await api.post(endpoints.Bills, null, { params });
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.patch(`${endpoints.Bills}/${id}/status`, null, { params: { status } });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`${endpoints.Bills}/${id}`);
        return response.data;
    },
};
