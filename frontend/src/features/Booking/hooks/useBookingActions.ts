import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BOOKING_SERVICE } from '../api';
import type { BookingStatus } from '../types/bookings.types';

export function useBookingDetails(id: number) {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => BOOKING_SERVICE.getById(id),
        enabled: !!id,
        select: (res) => res.data,
    });
}

export function useUpdateBookingStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: BookingStatus }) =>
            BOOKING_SERVICE.updateStatus(id, status),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ['booking', id] });
            qc.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}

export function useCancelBooking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => BOOKING_SERVICE.cancel(id),
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: ['booking', id] });
            qc.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}
