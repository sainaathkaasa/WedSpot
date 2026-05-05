import type { User } from '@/entities/user';
import type { VendorService } from '@/entities/vendor-service';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
    id: number;
    client: User;
    services: VendorService[];
    eventDate: string;
    eventLocation: string;
    guestCount: number;
    totalAmount: number;
    advancePaid: number;
    status: BookingStatus;
    notes: string;
    createdAt?: string;
    updatedAt?: string;
}
