import { User } from '@/interfaces/user'

export interface AuthResponse {
    user: User;
    expiresIn?: number;
}

export interface ErrorResponse {
    error: string;
    details?: Record<string, string>;
    code?: number;
}