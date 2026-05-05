import api from "@/api/axios";

export const BILLS_API = {
    getAll: async () => {
        const response = await api.get("/bills");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/bills/${id}`);
        return response.data;
    },
    getByClient: async (clientId: number) => {
        const response = await api.get(`/bills/client/${clientId}`);
        return response.data;
    },
    create: async (params: { invoiceNumber: string; clientId: number; amount: number; date: string }) => {
        const response = await api.post("/bills", null, { params });
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.patch(`/bills/${id}/status`, null, { params: { status } });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/bills/${id}`);
        return response.data;
    },
};
