
// Interfaces base
export interface BaseEntity<T> {
    id: number;
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
    id: number;
    name: string;
    age: string;
    role: string;
}
export interface SidebarItem {
    id: number;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    path: string;
    active: boolean;
} 