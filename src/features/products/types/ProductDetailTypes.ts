import { Review } from '@/features/experience/types/experienceTypes';
import { Product } from '@/features/products/components/ProductCard';

export interface ProductDetail extends Product {
    product_id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    images?: string[];
    rating: number;
    category?: string;
    stock: number;
    priceWithTax: number;
    experience_id?: number;
    features?: string[];
    specifications?: { [key: string]: string };
    reviews?: Review[];
    stats?: RatingStats;
    name_experience?: string;
    location?: string;
}


export interface RatingStats {
    rating: string;
    total: number;
    percent_5: string;
    percent_4: string;
    percent_3: string;
    percent_2: string;
    percent_1: string;
}

export interface CartItem {
    service_id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    priceWithTax: number;
    image: string;
}