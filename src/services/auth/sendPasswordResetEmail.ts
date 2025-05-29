import { axiosInstance } from '@/api/axiosInstance';
import { SendPasswordResetEmailResponse } from '@/interfaces/responsesApi';

export const sendPasswordResetEmail = async (email: string): Promise<SendPasswordResetEmailResponse> => {
    try {
        const response = await axiosInstance.post<SendPasswordResetEmailResponse>('/auth/recuperar-password', { email });

        if (Number(response.status) >= 200 && Number(response.status) < 300) {
            return {
                success: true,
                message: response.data.message || '¡Enlace enviado! Revisa tu correo electrónico.'
            };
        }

        throw new Error(`Error inesperado: ${response.status}`);

    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error al enviar el correo de recuperación'
        };
    }
};
