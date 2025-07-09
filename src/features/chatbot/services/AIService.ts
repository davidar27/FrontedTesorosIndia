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
            // Si la respuesta es un string, intentar parsearlo como JSON
            let parsedResponse;
            
            if (typeof response.data === 'string') {
                try {
                    parsedResponse = JSON.parse(response.data);
                } catch {
                    // Si no es JSON válido, usar como texto plano
                    return {
                        text: response.data,
                        success: true
                    };
                }
            } else if (typeof response.data === 'object') {
                // Si ya es un objeto, usarlo directamente
                parsedResponse = response.data;
            } else {
                // Fallback para otros tipos
                return {
                    text: String(response.data),
                    success: true
                };
            }

            // Si es JSON y tiene intent, retornar con intención
            if (parsedResponse.intent) {
                return {
                    text: parsedResponse.text || String(response.data),
                    intent: parsedResponse.intent,
                    success: true
                };
            }

            // Si es JSON pero no tiene intent, retornar texto normal
            return {
                text: parsedResponse.text || String(response.data),
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
            let parsedResponse;
            
            if (typeof response.data === 'string') {
                try {
                    parsedResponse = JSON.parse(response.data);
                } catch {
                    // Si no es JSON válido, usar como texto plano
                    return {
                        text: response.data,
                        success: true
                    };
                }
            } else if (typeof response.data === 'object') {
                // Si ya es un objeto, usarlo directamente
                parsedResponse = response.data;
            } else {
                // Fallback para otros tipos
                return {
                    text: String(response.data),
                    success: true
                };
            }

            // Si es JSON y tiene intent, retornar con intención
            if (parsedResponse.intent) {
                return {
                    text: parsedResponse.text || String(response.data),
                    intent: parsedResponse.intent,
                    success: true
                };
            }

            // Si es JSON pero no tiene intent, retornar texto normal
            return {
                text: parsedResponse.text || String(response.data),
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