import { BaseEntity } from "@/components/admin/GenericManagent";

export interface Entrepreneur extends BaseEntity<'active' | 'inactive' | 'pending'> {
    id: number;
    name: string;
    email: string;
    phone: string;
    image?: string | null;
    joinDate: string;
    status: 'active' | 'inactive' | 'pending';
    farm: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateEntrepreneurData {
    name: string;
    email: string;
    password: string;
    phone: string;
    farm: string;
}

export interface UpdateEntrepreneurData {
    name?: string;
    email?: string;
    phone?: string;
    farm?: string;
    status?: 'active' | 'inactive' | 'pending';
    image?: string;
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