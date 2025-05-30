import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { AuthError } from "@/interfaces/responsesApi";

interface ResendResponse {
    success: boolean;
    message: string;
}

export const resendVerificationEmail = async (email: string): Promise<ResendResponse> => {
    if (!email || !email.trim()) {
        throw new AuthError("El correo electrónico es requerido", {
            errorType: "email"
        });
    }

    try {
        const response = await axiosInstance.post<ResendResponse>('/auth/reenviar-correo-verificacion', { 
            email: email.trim() 
        });

        return {
            success: true,
            message: response.data.message || 'Correo de verificación reenviado exitosamente'
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.response?.data?.details ||
                               'Error al reenviar el correo';
            
            throw new AuthError(errorMessage, {
                errorType: "email"
            });
        }
        throw new AuthError('Error desconocido al reenviar el correo', {
            errorType: "general"
        });
    }
};