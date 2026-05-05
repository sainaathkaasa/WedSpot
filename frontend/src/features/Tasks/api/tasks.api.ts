import api from "@/api/axios";

export const TASKS_API = {
    getAll: async () => {
        const response = await api.get("/tasks");
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },
    getByUser: async (userId: number) => {
        const response = await api.get(`/tasks/user/${userId}`);
        return response.data;
    },
    create: async (data: { text: string; priority: string; dueDate: string; category: string; points?: number; assignedToId?: number; bookingId?: number }) => {
        const response = await api.post("/tasks", data);
        return response.data;
    },
    update: async (id: number, data: { text: string; priority: string; dueDate: string; category: string; points?: number; assignedToId?: number }) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },
    toggle: async (id: number) => {
        const response = await api.patch(`/tasks/${id}/toggle`);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};
