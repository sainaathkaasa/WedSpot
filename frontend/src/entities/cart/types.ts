import type { VendorService } from '@/entities/vendor-service';

export interface CartItem extends VendorService {
    type: string;
}

export interface CartContextType {
    items: CartItem[];
    addToCart: (service: CartItem, quantity?: number) => void;
    removeFromCart: (serviceId: string) => void;
    updateQuantity: (serviceId: string, quantity: number) => void;
    clearCart: () => void;
    isItemInCart: (serviceId: string) => boolean;
}
