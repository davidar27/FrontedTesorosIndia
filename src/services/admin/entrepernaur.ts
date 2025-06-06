/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/api/axiosInstance';
import { Entrepreneur, CreateEntrepreneurData, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { normalizeStatus } from '@/features/admin/entrepreneurs/normalizeStatus';

interface EntrepreneurResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    image: string | null;
    imageUrl?: string;
    status: string;
    joinDate: string;
    name_experience: string;
}

interface EntrepreneurUpdateResponse {
    message: string;
    updatedFields: Partial<Entrepreneur>;
}

// Función auxiliar para construir la URL completa de la imagen
const getImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;

    try {
        // Si la ruta ya es una URL completa, devolverla
        if (imagePath.startsWith('http')) return imagePath;

        // Construir la URL completa usando la URL base de la API
        return `${import.meta.env.VITE_API_URL}${imagePath}`;
    } catch (error) {
        console.error('Error procesando ruta de imagen:', error);
        return null;
    }
};

export const entrepreneursApi = {
    getAll: async (): Promise<Entrepreneur[]> => {
        const response = await axiosInstance.get<EntrepreneurResponse[]>('dashboard/emprendedores');
        if (!response.data || !Array.isArray(response.data)) return [];
        return response.data.map(entrepreneur => ({
            id: entrepreneur.id,
            name: entrepreneur.name,
            email: entrepreneur.email,
            phone: entrepreneur.phone,
            image: getImageUrl(entrepreneur.image),
            status: normalizeStatus(entrepreneur.status),
            joinDate: entrepreneur.joinDate,
            name_experience: entrepreneur.name_experience
        }));
    },

    // Obtener un emprendedor por ID
    getById: async (id: number): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.get<Entrepreneur>(`/dashboard/emprendedor/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching entrepreneur:', error);
            throw new Error('Error al obtener el emprendedor');
        }
    },

    // Crear un nuevo emprendedor
    create: async (data: CreateEntrepreneurData): Promise<Entrepreneur> => {
        const response = await axiosInstance.post<EntrepreneurUpdateResponse>(
            '/dashboard/emprendedores/crear',
            data
        );
        const updated = response.data.updatedFields;
        return {
            id: updated.id ?? 0,
            name: updated.name ?? '',
            email: updated.email ?? '',
            phone: updated.phone ?? '',
            image: getImageUrl(updated.image) ?? null,
            status: normalizeStatus(updated.status ?? 'active'),
            joinDate: updated.joinDate ?? '',
            name_experience: updated.name_experience ?? '',
        };
    },

    // Actualizar un emprendedor
    update: async (id: number, data: Partial<UpdateEntrepreneurData>): Promise<Entrepreneur> => {
        const formData = new FormData();
        if (data.name?.trim()) formData.append('name', data.name.trim());
        if (data.email?.trim()) formData.append('email', data.email.trim());
        if (data.phone?.trim()) formData.append('phone', data.phone.trim());
        if (data.name_experience?.trim()) formData.append('name_experience', data.name_experience.trim());
        if (data.image instanceof File) formData.append('file', data.image);
        const response = await axiosInstance.put<EntrepreneurUpdateResponse>(
            `/dashboard/emprendedores/actualizar/${id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const updated = response.data.updatedFields;
        return {
            id: updated.id ?? id,
            name: updated.name ?? '',
            email: updated.email ?? '',
            phone: updated.phone ?? '',
            image: getImageUrl(updated.image) ?? null,
            status: normalizeStatus(updated.status ?? 'active'),
            joinDate: updated.joinDate ?? '',
            name_experience: updated.name_experience ?? '',
        };
    },

    // Cambiar estado de un emprendedor
    changeStatus: async (id: number, status: 'active' | 'inactive' | 'pending'): Promise<Entrepreneur> => {
        const response = await axiosInstance.patch<Entrepreneur>(`/dashboard/emprendedores/estado/${id}`, { status });
        return response.data;
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
    },

    // Eliminar un emprendedor completamente
    delete: async (userId: number): Promise<void> => {
        await axiosInstance.delete(`/dashboard/emprendedores/${userId}`);
    }
};