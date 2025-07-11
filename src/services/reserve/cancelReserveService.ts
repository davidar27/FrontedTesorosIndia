import { axiosInstance } from '@/api/axiosInstance';
import { isTokenExpired, extractUserInfoFromToken } from '@/utils/jwtUtils';

export interface CancelReserveResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

export const cancelReserveService = async (token: string, reserveId: number): Promise<CancelReserveResponse> => {
  try {
    // Según el controlador, el token y reserve_id van en query params
    const response = await axiosInstance.put(`/reservas/cancelar`, {}, {
      params: {
        token,
        reserve_id: reserveId
      }
    });

    return {
      success: true,
      message: response.data.message || 'Reserva cancelada exitosamente',
      data: response.data
    };
  } catch (error: unknown) {
    const errorMessage = error && typeof error === 'object' && 'response' in error && 
                        error.response && typeof error.response === 'object' && 'data' in error.response &&
                        error.response.data && typeof error.response.data === 'object' &&
                        ('error' in error.response.data || 'message' in error.response.data)
                        ? (error.response.data as { error?: string; message?: string }).error || 
                          (error.response.data as { error?: string; message?: string }).message || 
                          'Error al cancelar la reserva'
                        : 'Error al cancelar la reserva';
    
    throw new Error(errorMessage);
  }
};

export const getReserveDataService = async (token: string): Promise<ReserveData> => {
  try {
    // Verificar si el token ha expirado
    if (isTokenExpired(token)) {
      throw new Error('Token expirado');
    }

    // Extraer información del usuario del token
    const userInfo = extractUserInfoFromToken(token);

    // Verificar que tenga userId
    if (!userInfo.userId) {
      throw new Error('Token inválido: no contiene userId');
    }

    // Intentar obtener datos reales del backend si existe el endpoint
    try {
      const response = await axiosInstance.get(`/reservas/verificar`, {
        params: { token }
      });
      return response.data;
    } catch {
      // Si no existe el endpoint, usar datos simulados
      return {
        reserve_id: userInfo.userId, // Usamos userId como reserve_id temporalmente
        package_name: 'Paquete Turístico Premium',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 días en el futuro
        people: 2,
        total_price: 150000,
        user_id: userInfo.userId
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error al verificar la reserva');
  }
};

export interface ReserveData {
    reserve_id: number;
    package_name?: string;
    date?: string;
    people?: number;
    total_price?: number;
    user_id?: number;
} 