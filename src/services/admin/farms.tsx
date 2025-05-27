/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/api/axiosInstance';
import { CreateEntrepreneurData, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { FarmApiResponse, Farm } from '@/features/admin/farms/FarmTypes';



export const farmsApi = {
    // Obtener todos los emprendedores
    getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<Farm[]> => {
        try {
            const response = await axiosInstance.get<FarmApiResponse>('finca/fincas', { params });
            return response.data.farms || response.data as any;
        } catch (error) {
            console.error('Error fetching farms:', error);
            throw new Error('Error al obtener las fincas');
        }
    },

    // Obtener un emprendedor por ID
    getById: async (id: number): Promise<Farm> => {
        try {
            const response = await axiosInstance.get<Farm>(`/finca/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching farm:', error);
            throw new Error('Error al obtener la finca');
        }
    },

    // Crear un nuevo emprendedor
    create: async (data: CreateEntrepreneurData): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.post<Entrepreneur>('fincas', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating entrepreneur:', error);

            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Datos inválidos');
            }
            if (error.response?.status === 409) {
                throw new Error('Ya existe un emprendedor con este correo electrónico');
            }

            throw new Error('Error al crear el emprendedor');
        }
    },

    // Actualizar un emprendedor
    update: async (id: number, data: UpdateEntrepreneurData): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.put<Entrepreneur>(`/usuario/emprendedores/${id}`, data);
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

    // Eliminar un emprendedor
    delete: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/usuario/emprendedores/${id}`);
        } catch (error: any) {
            console.error('Error deleting entrepreneur:', error);

            if (error.response?.status === 404) {
                throw new Error('Emprendedor no encontrado');
            }

            throw new Error('Error al eliminar el emprendedor');
        }
    },

    // Cambiar estado de un emprendedor
    changeStatus: async (id: number, status: 'active' | 'inactive' | 'pending'): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.patch<Entrepreneur>(`/usuario/emprendedores/${id}/status`, { status });
            return response.data;
        } catch (error: any) {
            console.error('Error changing entrepreneur status:', error);

            if (error.response?.status === 404) {
                throw new Error('Emprendedor no encontrado');
            }

            throw new Error('Error al cambiar el estado del emprendedor');
        }
    },

    // Buscar emprendedores
    search: async (query: string): Promise<Entrepreneur[]> => {
        try {
            const response = await axiosInstance.get<Entrepreneur[]>(`/usuario/emprendedores/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching entrepreneurs:', error);
            throw new Error('Error al buscar emprendedores');
        }
    }
};