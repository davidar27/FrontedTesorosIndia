import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

export const resendVerificationEmail = async (email: string) => {
    try {
        const response = await axiosInstance.post('/auth/resend-verification', { email });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error al reenviar el correo');
        }
        throw new Error('Error desconocido');
    }
};