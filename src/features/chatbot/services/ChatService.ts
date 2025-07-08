import { 
  IAProvider, 
  AuthProvider, 
  IARequest, 
  IARegisteredRequest, 
  IAResponse,
  ChatMessage,
  CurrentUser,
  APIHistoryItem
} from '../interfaces/IAInterfaces';

export class ChatService {
    constructor(
        private iaProvider: IAProvider,
        private authProvider: AuthProvider
    ) { }

    async sendMessage(message: string, history: ChatMessage[]): Promise<IAResponse> {
        try {
            const currentUser = await this.authProvider.getCurrentUser();
            const isAuthenticated = this.authProvider.isAuthenticated();

            if (isAuthenticated && currentUser) {
                // Usuario autenticado - usar endpoint registrado
                const request: IARegisteredRequest = {
                    prompt: message,
                    history: this.formatHistoryForAPI(history),
                    userId: currentUser.id,
                    role: currentUser.role
                };

                return await this.iaProvider.getRegisteredResponse(request);
            } else {
                // Usuario no autenticado - usar endpoint público
                const request: IARequest = {
                    prompt: message,
                    history: this.formatHistoryForAPI(history)
                };

                return await this.iaProvider.getResponse(request);
            }
        } catch (error) {
            console.error('Error in ChatService:', error);
            return {
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }

      private formatHistoryForAPI(history: ChatMessage[]): APIHistoryItem[] {
    return history.map(message => ({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text
    }));
  }

    async getCurrentUser(): Promise<CurrentUser | null> {
        return await this.authProvider.getCurrentUser();
    }

    isAuthenticated(): boolean {
        return this.authProvider.isAuthenticated();
    }
} 