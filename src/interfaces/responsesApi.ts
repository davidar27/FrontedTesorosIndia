import { User } from '@/interfaces/user'
export interface AuthErrorResponse {
    error?: {
        type: 'email' | 'password' | 'general';
        message: string;
    };
    user?: User;
}

// interfaces/responsesApi.ts
export interface AuthResponse {
    user?: User;
    error?: {
        type: 'email' | 'password' | 'general';
        message: string;
        redirectTo?: string;
    };
    success?: boolean;
}

// interfaces/errors.ts
export interface ApiError {
    message: string;
    type?: string;
    code?: number;
    redirectTo?: string;
}

export class AuthError extends Error {
    redirectTo?: string;
    errorType?: 'email' | 'password' | 'general';

    constructor(message: string, options?: { redirectTo?: string; errorType?: 'email' | 'password' | 'general' }) {
        super(message);
        this.redirectTo = options?.redirectTo;
        this.errorType = options?.errorType;
    }
}
