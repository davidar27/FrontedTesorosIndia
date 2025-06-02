import { BaseEntity } from "@/features/admin/types";

export interface Entrepreneur extends BaseEntity<'active' | 'inactive' | 'pending'> {
    name: string;
    email: string;
    phone: string;
    image: string | null;
    joinDate: string;
    status: 'active' | 'inactive' | 'pending';
    name_farm: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: string | number | boolean | Date | null | undefined;
}

export interface CreateEntrepreneurData {
    name: string;
    email: string;
    password: string;
    phone: string;
    name_farm: string;
}

export interface UpdateEntrepreneurData {
    name: string;
    email: string;
    phone: string;
    name_farm: string;
    image?: File;
}

export interface EntrepreneurApiResponse {
    entrepreneurs: Entrepreneur[];
    total: number;
    page: number;
    limit: number;
}

export interface EntrepreneurCardProps {
    entrepreneur: Entrepreneur;
    onEdit: (entrepreneur: Entrepreneur) => void;
    onDelete: (id: number) => void;
}

// Tipos para autenticación
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions?: string[];
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
    message?: string;
}