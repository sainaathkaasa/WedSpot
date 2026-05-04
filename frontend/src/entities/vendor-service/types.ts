import type { User } from '@/entities/user';

export interface Review {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    date: string;
    comment: string;
}

export interface Vendor {
    id: string;
    name: string;
    description: string;
    services: string[];
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
    location: string;
    sectorId: string;
    reviews?: Review[];
}

export interface VendorService {
    id: number;
    name: string;
    description: string;
    tags: string[];
    imageUrl: string;
    rating: number;
    ratingCount: number;
    price: number;
    location: string;
    reviews?: Review[];
    quantity: number;
    category: string;
    vendor: User;
}

export interface VendorCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
}
