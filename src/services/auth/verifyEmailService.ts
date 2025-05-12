import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';

export const verifyEmail = async (token: string) => {
    try {
        const response = await axiosInstance.get('/auth/verificar-correo', {
            params: { token }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                'Error al verificar el email. El enlace puede haber expirado.'
            );
        }
        throw new Error('Error desconocido al verificar email');
    }
};