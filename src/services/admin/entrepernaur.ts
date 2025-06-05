/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/api/axiosInstance';
import { Entrepreneur, CreateEntrepreneurData, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';

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
    getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<Entrepreneur[]> => {
        try {
            const response = await axiosInstance.get<EntrepreneurResponse[]>('dashboard/emprendedores', { params });
            if (!response.data || !Array.isArray(response.data)) {
                console.log('No entrepreneurs data found in response');
                return [];
            }

            const entrepreneurs = response.data.map(entrepreneur => {
                let status: 'active' | 'inactive' | 'pending';
                switch (entrepreneur.status.toLowerCase()) {
                    case 'activo':
                        status = 'active';
                        break;
                    case 'inactivo':
                        status = 'inactive';
                        break;
                    default:
                        status = 'pending';
                }

                return {
                    id: entrepreneur.id,
                    name: entrepreneur.name,
                    email: entrepreneur.email,
                    phone: entrepreneur.phone,
                    image: getImageUrl(entrepreneur.image),
                    status,
                    joinDate: entrepreneur.joinDate,
                    name_experience: entrepreneur.name_experience
                } as Entrepreneur;
            });

            const statusOrder = {
                'active': 0,
                'pending': 1,
                'inactive': 2
            };

            const sortedEntrepreneurs = entrepreneurs.sort((a, b) => {
                const statusDiff = statusOrder[a.status] - statusOrder[b.status];
                if (statusDiff !== 0) return statusDiff;

                const dateA = new Date(a.joinDate.split('/').reverse().join('-'));
                const dateB = new Date(b.joinDate.split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
            });

            return sortedEntrepreneurs;

        } catch (error: any) {
            console.error('Error fetching entrepreneurs:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(`Error al obtener los emprendedores: ${error.response?.data?.message || error.message}`);
        }
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
        try {
            // Validar campos requeridos
            if (!data.name?.trim()) throw new Error('El nombre es requerido');
            if (!data.email?.trim()) throw new Error('El email es requerido');
            if (!data.password?.trim()) throw new Error('La contraseña es requerida');
            if (!data.phone?.trim()) throw new Error('El teléfono es requerido');
            if (!data.name_experience?.trim()) throw new Error('El nombre de la experiencia es requerido');

            const entrepreneurData = {
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password.trim(),
                phone: data.phone.trim(),
                name_experience: data.name_experience.trim()
            };

            console.log('Datos a enviar:', {
                ...entrepreneurData,
                password: '********'
            });

            const response = await axiosInstance.post<EntrepreneurUpdateResponse>(
                '/dashboard/emprendedores/crear',
                entrepreneurData
            );

            if (!response.data || !response.data.updatedFields) {
                throw new Error('Respuesta inválida del servidor');
            }

            const entrepreneur: Entrepreneur = {
                id: response.data.updatedFields.id ?? 0,
                name: response.data.updatedFields.name ?? '',
                email: response.data.updatedFields.email ?? '',
                phone: response.data.updatedFields.phone ?? '',
                image: getImageUrl(response.data.updatedFields.image) ?? null,
                status: response.data.updatedFields.status ?? 'active',
                joinDate: response.data.updatedFields.joinDate ?? '',
                name_experience: response.data.updatedFields.name_experience ?? '',
            };

            return entrepreneur;

        } catch (error: any) {
            console.error('Error creating entrepreneur:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Datos inválidos');
            }
            if (error.response?.status === 409) {
                throw new Error('Ya existe un emprendedor con este correo electrónico');
            }

            if (error.message.includes('requerido')) {
                throw error;
            }

            throw new Error(error.message || 'Error al crear el emprendedor');
        }
    },

    // Actualizar un emprendedor
    update: async (id: number, data: Partial<UpdateEntrepreneurData>): Promise<Partial<Entrepreneur>> => {
        try {
            const formData = new FormData();
            
            if (data.name?.trim()) formData.append('name', data.name.trim());
            if (data.email?.trim()) formData.append('email', data.email.trim());
            if (data.phone?.trim()) formData.append('phone', data.phone.trim());
            if (data.name_experience?.trim()) formData.append('name_experience', data.name_experience.trim());
            
            if (data.image instanceof File) {
                console.log('Subiendo imagen:', {
                    nombre: data.image.name,
                    tipo: data.image.type,
                    tamaño: data.image.size
                });
                formData.append('file', data.image);
            }

            const response = await axiosInstance.put<EntrepreneurUpdateResponse>(
                `/dashboard/emprendedores/actualizar/${id}`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (!response.data || !response.data.updatedFields) {
                throw new Error('Respuesta inválida del servidor');
            }

            const updated = response.data.updatedFields;
            const entrepreneur: Entrepreneur = {
                id: updated.id ?? id,
                name: updated.name ?? '',
                email: updated.email ?? '',
                phone: updated.phone ?? '',
                image: getImageUrl(updated.image) ?? null,
                status: updated.status ?? 'active',
                joinDate: updated.joinDate ?? '',
                name_experience: updated.name_experience ?? '',
            };
            return entrepreneur;
        } catch (error: any) {
            console.error('Error updating entrepreneur:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Error al actualizar el emprendedor');
        }
    },


    // Cambiar estado de un emprendedor
    changeStatus: async (id: number, status: 'active' | 'inactive' | 'pending'): Promise<Entrepreneur> => {
        try {
            const response = await axiosInstance.patch<Entrepreneur>(`/dashboard/emprendedores/estado/${id}`, { status });
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
    },

    // Eliminar un emprendedor completamente
    delete: async (userId: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/dashboard/emprendedores/${userId}`);
        } catch (error: any) {
            console.error('Error deleting entrepreneur:', error);
            if (error.response?.status === 404) {
                throw new Error('Emprendedor no encontrado');
            }
            throw new Error('Error al eliminar el emprendedor');
        }
    }
};