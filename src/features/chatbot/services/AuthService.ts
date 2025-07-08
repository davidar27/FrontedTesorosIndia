import { AuthProvider, CurrentUser, UserRole } from '../interfaces/IAInterfaces';
import { useAuth } from '@/context/AuthContext';

export class ChatbotAuthService implements AuthProvider {
    private authContext: ReturnType<typeof useAuth>;

    constructor() {
        // En React, necesitamos acceder al contexto de manera diferente
        // Esta implementación será ajustada en el contexto del chatbot
        this.authContext = {} as ReturnType<typeof useAuth>;
    }

    setAuthContext(authContext: ReturnType<typeof useAuth>) {
        this.authContext = authContext;
    }

    async getCurrentUser(): Promise<CurrentUser | null> {
        try {
            const user = this.authContext.user;

            if (!user) {
                return null;
            }

            return {
                id: Number(user.id),
                role: this.mapRole(user.role),
                email: user.email
            };
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    isAuthenticated(): boolean {
        return this.authContext.isAuthenticated || false;
    }

    private mapRole(role: string): UserRole {
        switch (role.toLowerCase()) {
            case 'cliente':
                return 'cliente';
            case 'emprendedor':
                return 'emprendedor';
            case 'administrador':
                return 'administrador';
            default:
                return 'observador';
        }
    }
}

export const chatbotAuthService = new ChatbotAuthService(); 