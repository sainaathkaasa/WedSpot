import api from '@/api/axios';

export const DASHBOARD_API = {
    getAdminMetrics: async () => {
        const response = await api.get('/dashboard/admin');
        return response.data;
    },
    getManagerMetrics: async () => {
        const response = await api.get('/dashboard/manager');
        return response.data;
    },
    getStaffMetrics: async () => {
        const response = await api.get('/dashboard/staff');
        return response.data;
    },
    getVendorMetrics: async (vendorId: number) => {
        const response = await api.get('/dashboard/vendor', { params: { vendorId } });
        return response.data;
    },
    getClientMetrics: async (clientId: number) => {
        const response = await api.get('/dashboard/client', { params: { clientId } });
        return response.data;
    },
};
