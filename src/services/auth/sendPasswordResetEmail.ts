import { axiosInstance } from '@/api/axiosInstance';
import { AuthError } from '@/interfaces/responsesApi';
export const sendPasswordResetEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post('/auth/send-password-reset-email', { email });
        return response.data;
    } catch  {
        throw new AuthError('Error al enviar el correo de restablecimiento de contraseña');
    }
};
