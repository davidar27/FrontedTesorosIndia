import { BaseEntity } from "@/features/admin/types";

export type EntrepreneurStatus = 'active' | 'inactive' | 'pending';

export interface Entrepreneur extends BaseEntity<EntrepreneurStatus, number> {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    joinDate: string;
    status: EntrepreneurStatus;
    name_experience: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: string | number | boolean | Date | null | undefined;
}

export interface CreateEntrepreneurData {
    name: string;
    email: string;
    password: string;
    phone: string;
    name_experience: string;
}

export interface UpdateEntrepreneurData {
    name: string;
    email: string;
    phone: string;
    name_experience: string;
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
    onChangeStatus: (id: number, status: string) => void;
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