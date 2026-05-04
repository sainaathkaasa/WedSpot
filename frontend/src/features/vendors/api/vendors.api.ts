import api from '@/api/axios';
import endpoints from '@/api/ApiEndpoints';

export const VENDOR_API = {
    getAllServices: async () => {
        const response = await api.get(endpoints.GetAllVendorServices);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`${endpoints.GetVendorService}/${id}`);
        return response.data;
    },
};
