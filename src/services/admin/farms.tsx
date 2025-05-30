/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/api/axiosInstance';
import { CreateEntrepreneurData, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { FarmApiResponse, Farm } from '@/features/admin/farms/FarmTypes';



export const farmsApi = {
    // Obtener todos los fincas
    getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<Farm[]> => {
        try {
            const response = await axiosInstance.get<FarmApiResponse>('/finca/', { params });
            console.log('API Response:', response.data);
            if (Array.isArray(response.data)) {
                return response.data;
            }
            if (response.data.farms) {
                return response.data.farms;
            }
            return [];
        } catch (error) {
            console.error('Error fetching farms:', error);
            throw new Error('Error al obtener las fincas');
        }
    },

    getAllNames: async (): Promise<Farm[]> => {
        try {
            const response = await axiosInstance.get<FarmApiResponse>('/finca/nombres');
            console.log('API Response:', response.data);
            if (Array.isArray(response.data)) {
                return response.data;
            }
            if (response.data.farms) {
                return response.data.farms;
            }
            return [];
        } catch (error) {
            console.error('Error fetching farms:', error);
            throw new Error('Error al obtener las fincas');
        }
    },


    // Obtener una finca por ID
    getById: async (id: number): Promise<Farm> => {
        try {
            const response = await axiosInstance.get<Farm>(`/finca/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching farm:', error);
            throw new Error('Error al obtener la finca');
        }
    },

    // Crear una nueva finca
    create: async (data: CreateEntrepreneurData): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.post<Entrepreneur>('fincas', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating farm:', error);

            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Datos inválidos');
            }
            if (error.response?.status === 409) {
                throw new Error('Ya existe una finca con este correo electrónico');
            }

                throw new Error('Error al crear la finca');
        }
    },

    // Actualizar una finca
    update: async (id: number, data: UpdateEntrepreneurData): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.put<Entrepreneur>(`/finca/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating entrepreneur:', error);

            if (error.response?.status === 404) {
                throw new Error('Emprendedor no encontrado');
            }
            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Datos inválidos');
            }

            throw new Error('Error al actualizar el emprendedor');
        }
    },

    // Eliminar una finca
    delete: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/finca/${id}`);
        } catch (error: any) {
            console.error('Error deleting farm:', error);

            if (error.response?.status === 404) {
                throw new Error('Finca no encontrada');
            }

            throw new Error('Error al eliminar la finca');
        }
    },

    // Cambiar estado de una finca
    changeStatus: async (id: number, status: 'active' | 'inactive' | 'pending'): Promise<Farm> => {
        try {
            const response = await axiosInstance.patch<Farm>(`/finca/${id}/status`, { status });
            return response.data;
        } catch (error: any) {
            console.error('Error changing farm status:', error);

            if (error.response?.status === 404) {
                throw new Error('Finca no encontrada');
            }

            throw new Error('Error al cambiar el estado de la finca');
        }
    },

    // Buscar fincas
    search: async (query: string): Promise<Farm[]> => {
        try {
            const response = await axiosInstance.get<Farm[]>(`/finca/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching farms:', error);
            throw new Error('Error al buscar fincas');
        }
    }
};