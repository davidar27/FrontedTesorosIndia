export interface IARequest {
    prompt: string;
    history: APIHistoryItem[];
}

export interface IARegisteredRequest extends IARequest {
    userId: number;
    role: UserRole;
}

export interface IAResponse {
    text: string;
    intent?: {
        type: 'packages' | 'products' | 'experiences' | 'categories' | 'none';
        confidence: number;
        redirectTo: string;
        message: string;
        buttonText: string;
    };
    success: boolean;
    error?: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface APIHistoryItem {
    role: string;
    content: string;
}

export type UserRole = 'cliente' | 'emprendedor' | 'administrador' | 'observador';

// Interfaz para el servicio de IA (Principio de Inversión de Dependencias)
export interface IAProvider {
    getResponse(request: IARequest): Promise<IAResponse>;
    getRegisteredResponse(request: IARegisteredRequest): Promise<IAResponse>;
}

// Interfaz para el servicio de autenticación
export interface AuthProvider {
    getCurrentUser(): Promise<CurrentUser | null>;
    isAuthenticated(): boolean;
}

export interface CurrentUser {
    id: number;
    role: UserRole;
    email: string;
} 