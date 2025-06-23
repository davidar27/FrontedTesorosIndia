// Interfaces base
export interface BaseEntity<T> {
    id: string;
    name: string;
    description: string;
    status: T;
    email?: string;
    phone?: string;
    category?: string;
    type?: string;
}

// Interfaces específicas
export interface Leader {
    id: string;
    name: string;
    age: string;
    role: string;
}

export interface Location {
    id: string;
    name: string;
    position: {
        lat: number;
        lng: number;
    };
    description: string;
    type: string;
}

export interface Package {
    image: string;
    title: string;
    price: string;
    category?: string;
    has_food: boolean | number;
    description: string;
    features?: string[];
    onClick: () => void;
}

export interface SidebarItem {
    id: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    path: string;
    active: boolean;
} 