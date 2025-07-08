import { axiosInstance } from '@/api/axiosInstance';
import {
    IAProvider,
    IARequest,
    IARegisteredRequest,
    IAResponse
} from '../interfaces/IAInterfaces';

export class AIService implements IAProvider {
    private readonly baseURL = '/IA';

    async getResponse(request: IARequest): Promise<IAResponse> {
        try {
            const response = await axiosInstance.post(`${this.baseURL}/`, {
                prompt: request.prompt,
                history: request.history
            });

            return {
                text: response.data,
                success: true
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return {
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                success: false,
                error: errorMessage
            };
        }
    }

    async getRegisteredResponse(request: IARegisteredRequest): Promise<IAResponse> {
        try {
            const response = await axiosInstance.post(`${this.baseURL}/registrado`, {
                prompt: request.prompt,
                history: request.history,
                userId: request.userId,
                role: request.role
            });

            return {
                text: response.data,
                success: true
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return {
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                success: false,
                error: errorMessage
            };
        }
    }
}

// Instancia singleton del servicio
export const aiService = new AIService(); 