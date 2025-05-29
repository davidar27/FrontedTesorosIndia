import { axiosInstance } from '@/api/axiosInstance';

export const resetPassword = async (token: string, password: string, confirmPassword: string): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/auth/restablecer-password?token=${token}`, {
      password,
      confirmPassword
    });

    if (Number(response.status) !== 200) {
      const error = response.data;
      throw new Error(error.message || 'Error al restablecer la contraseña');
    }
  } catch {
    throw new Error('Error al restablecer la contraseña');
  }
}; 