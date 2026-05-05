import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VENDOR_SERVICE } from '../api';
import type { VendorFormData } from '../types';

export function useVendorServices(vendorId: number) {
    return useQuery({
        queryKey: ['vendor-services', vendorId],
        queryFn: () => VENDOR_SERVICE.getVendorServices(vendorId),
        enabled: !!vendorId,
    });
}

export function useCreateVendorService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: VendorFormData) => VENDOR_SERVICE.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vendor-services'] }),
    });
}

export function useUpdateVendorService(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: VendorFormData) => VENDOR_SERVICE.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vendor-services'] }),
    });
}

export function useDeleteVendorService() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => VENDOR_SERVICE.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['vendor-services'] }),
    });
}
