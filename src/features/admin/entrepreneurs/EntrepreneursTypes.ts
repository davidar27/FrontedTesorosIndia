import { BaseEntity } from "@/features/admin/types";

export type EntrepreneurStatus = 'active' | 'inactive';

export interface Entrepreneur extends BaseEntity<EntrepreneurStatus, number> {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    joinDate: string;
    status: EntrepreneurStatus;
    name_experience: string;
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
    image?: File | FormData;
}

export interface EntrepreneurApiResponse {
    entrepreneurs: Entrepreneur[];
    total: number;
    page: number;
    limit: number;
}

export interface EntrepreneurCardProps {
    entrepreneur: Entrepreneur;
    onUpdate: (entrepreneur: Entrepreneur) => void;
    onChangeStatus: (id: string, status: string) => void;
}

// Tipos para autenticación
export interface User {
    id: string;
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