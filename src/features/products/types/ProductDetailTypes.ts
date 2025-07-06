export interface ProductDetail {
    product_id: number;
    name: string;
    description: string;
    price: string;
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
    name_experience?: string;
    location?: string;
}

export interface Review {
    review_id: number;
    user_name: string;
    rating: number;
    review?: string | null;
    review_date: string;
    user_image?: string;
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