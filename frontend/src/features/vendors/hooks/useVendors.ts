import { useQuery } from '@tanstack/react-query';
import { VENDOR_API } from '../api';

export function useVendors() {
    return useQuery({
        queryKey: ['premium-services'],
        queryFn: VENDOR_API.getAllServices,
        staleTime: 5 * 60 * 1000,
    });
}

export function useVendorDetails(id: string) {
    return useQuery({
        queryKey: ['vendor-service', id],
        queryFn: () => VENDOR_API.getById(id),
        enabled: !!id,
    });
}
