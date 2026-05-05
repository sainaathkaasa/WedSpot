import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_API } from '../api';

export function useDashboardData(role: string, userId?: number) {
    return useQuery({
        queryKey: ['dashboard', role, userId],
        queryFn: async () => {
            switch (role) {
                case 'ADMIN':
                    return DASHBOARD_API.getAdminMetrics();
                case 'MANAGER':
                    return DASHBOARD_API.getManagerMetrics();
                case 'STAFF':
                    return DASHBOARD_API.getStaffMetrics();
                case 'VENDOR':
                    if (!userId) throw new Error('Vendor ID required');
                    return DASHBOARD_API.getVendorMetrics(userId);
                case 'CLIENT':
                    if (!userId) throw new Error('Client ID required');
                    return DASHBOARD_API.getClientMetrics(userId);
                default:
                    return DASHBOARD_API.getClientMetrics(userId || 0);
            }
        },
        enabled: !!role && (role !== 'VENDOR' && role !== 'CLIENT' || !!userId),
    });
}
