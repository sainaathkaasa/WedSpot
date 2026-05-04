import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_API } from '../api';

export function useDashboardData(role: string) {
    const queryFns: Record<string, () => Promise<unknown>> = {
        ADMIN: DASHBOARD_API.getAdminMetrics,
        MANAGER: DASHBOARD_API.getManagerMetrics,
        STAFF: DASHBOARD_API.getStaffMetrics,
        VENDOR: DASHBOARD_API.getVendorMetrics,
        CLIENT: DASHBOARD_API.getClientMetrics,
    };
    return useQuery({
        queryKey: ['dashboard', role],
        queryFn: queryFns[role] ?? queryFns.CLIENT,
        enabled: !!role,
    });
}
