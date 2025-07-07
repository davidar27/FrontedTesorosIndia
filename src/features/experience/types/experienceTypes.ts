
export interface Experience {
    id: number;
    name: string;
    history: string;
    description: string;
    type: string;
    image: string;
    lat: number;
    lng: number;
    name_entrepreneur?: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

export interface TeamMember {
    id: number;
    name: string;
    age: number;
    profession: string;
    description: string;
    image: string;
}


export interface Review {
    review_id: number;
    userId: number;
    user_name: string;
    user_image: string | null;
    review_date: string;
    rating: number;
    comment: string;
    responses: Review[];
}



