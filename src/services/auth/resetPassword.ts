import { axiosInstance } from '@/api/axiosInstance';

export const resetPassword = async (token: string, password: string, confirmPassword: string): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/auth/password/restablecer?token=${token}`, {
      password,
      confirmPassword
    });

    if (Number(response.status) !== 200) {
      const error = response.data;
      throw new Error(error.message || 'Error al restablecer la contraseña');
    }
  } catch (error: unknown) {
    // Mejorar el manejo de errores para mostrar mensajes específicos del backend
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    throw new Error('Error al restablecer la contraseña');
  }
}; 