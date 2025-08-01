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
        type: string; // Permitir cualquier string para tipos personalizados
        confidence: number;
        redirectTo: string;
        message: string;
        buttonText: string;
    };
    success: boolean;
    error?: string;
    data?: unknown[]; // <-- Permitir datos adicionales del backend
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    data?: unknown[]; // <-- Permitir datos adicionales en el mensaje
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
    experience_id?: string;
} 