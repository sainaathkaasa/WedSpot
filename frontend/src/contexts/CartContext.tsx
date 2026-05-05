import React, { useEffect, useState } from 'react';
import type { CartItem } from '@/entities/cart';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { CartContext } from './cartContextValue';

type PersistedCartItem = CartItem & {
    numericPrice?: number;
    priceRange?: string;
};

/**
 * Utility to extract a base numeric price from a range string (e.g., "$1,200 - $5,000" -> 1200)
 */
const extractNumericPrice = (priceRange: string): number => {
    if (!priceRange) return 0;
    // Remove symbols, commas, and white-space, then get the first number
    const match = priceRange.replace(/[,₹$]/g, '').match(/\d+/);
    const val = match ? parseInt(match[0], 10) : 0;
    return isNaN(val) ? 0 : val;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('wedding_craft_cart');
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            // Re-validate and ensure numericPrice exists for migration safety
            return (parsed as PersistedCartItem[]).map((item) => ({
                ...item,
                numericPrice: item.numericPrice || item.price || extractNumericPrice(item.priceRange || '')
            }));
        } catch {
            return [];
        }
    });

    const { warning, success, info } = useSnackbar();

    useEffect(() => {
        localStorage.setItem('wedding_craft_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (service: CartItem, quantity: number = 1) => {
        const isCatering = (service.type || service.category || '').toLowerCase() === 'catering';
        const existingItem = items.find(item => String(item.id) === String(service.id));

        if (existingItem) {
            const prevQty = existingItem.quantity;
            const newQty = prevQty + quantity;
            const unit = isCatering ? 'plates' : 'items';

            if (isCatering) {
                // Update quantity for catering
                setItems(prev => prev.map(item =>
                    String(item.id) === String(service.id) ? { ...item, quantity: newQty } : item
                ));
                success(`${service.name}: ${prevQty} → ${newQty} ${unit}`);
            } else {
                // Already added for general
                warning(`${service.name} is already in your booking list`);
            }
            return;
        }

        const newItem: CartItem = {
            id: service.id,
            name: service.name,
            vendor: service.vendor,
            imageUrl: service.imageUrl,
            price: service.price,
            category: service.category,
            description: service.description,
            quantity: quantity,
            type: isCatering ? 'catering' : 'general',
            rating: service.rating,
            tags: service.tags,
            ratingCount: service.ratingCount,
            location: service.location,
            reviews: service.reviews
        };

        setItems(prev => [...prev, newItem]);
        success(`${service.vendor.name} added to cart`);
    };

    const removeFromCart = (serviceId: string) => {
        setItems(prev => prev.filter(item => String(item.id) !== String(serviceId)));
        info('Item removed from cart');
    };

    const updateQuantity = (serviceId: string, quantity: number) => {
        const targetId = String(serviceId);
        const newQuantity = Math.max(1, Number(quantity));
        const item = items.find(i => String(i.id) === targetId);
        if (!item) return;

        const prevQty = item.quantity;
        const unit = item.type === 'catering' ? 'plates' : 'items';

        setItems(prev => prev.map(item =>
            String(item.id) === targetId ? { ...item, quantity: newQuantity } : item
        ));

        if (prevQty !== quantity) {
            info(`${item.vendor?.name || item.name}: ${prevQty} → ${quantity} ${unit}`);
        }
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('wedding_craft_cart');
    };

    const isItemInCart = (serviceId: string) => {
        return items.some(item => String(item.id) === String(serviceId));
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, isItemInCart }}>
            {children}
        </CartContext.Provider>
    );
};
