import type { VendorService } from '@/entities/vendor-service';

export type VendorFormData = Omit<VendorService, 'id' | 'rating' | 'ratingCount' | 'reviews' | 'quantity' | 'vendor'>;
