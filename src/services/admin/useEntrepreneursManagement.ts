import { axiosInstance } from '@/api/axiosInstance';
import { Entrepreneur, CreateEntrepreneurData, UpdateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { normalizeStatus, getImageUrl } from '@/features/admin/entrepreneurs/entrepreneurHelpers';
import { useGenericManagement } from '@/hooks/useGenericManagement';
import { useQueryClient } from '@tanstack/react-query';


export function useEntrepreneursManagement() {
    const queryClient = useQueryClient();

    return useGenericManagement<Entrepreneur>(
        'entrepreneurs',
        '/dashboard/emprendedores',
        {
            customEndpoints: {
                getAll: '/dashboard/emprendedores',
                getById: (id) => `/dashboard/emprendedor/${id}`,
                create: '/dashboard/emprendedores/crear',
                update: (id) => `/dashboard/emprendedores/actualizar/${id}`,
                delete: (id) => `/dashboard/emprendedores/${id}`,
                changeStatus: (id) => `/dashboard/emprendedores/estado/${id}`,
                search: '/usuario/emprendedores/search',
            },
            customMethods: {
                create: async (data: CreateEntrepreneurData) => {
                    const response = await axiosInstance.post(
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
                update: async (id: string | number, data: Partial<UpdateEntrepreneurData>) => {
                    const formData = new FormData();
                    if (data.name?.trim()) formData.append('name', data.name.trim());
                    if (data.email?.trim()) formData.append('email', data.email.trim());
                    if (data.phone?.trim()) formData.append('phone', data.phone.trim());
                    if (data.name_experience?.trim()) formData.append('name_experience', data.name_experience.trim());
                    if (data.image instanceof File) formData.append('file', data.image);
                    const response = await axiosInstance.put(
                        `/dashboard/emprendedores/actualizar/${id}`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                    const updated = response.data.updatedFields;
                    queryClient.setQueryData(['entrepreneurs'], (old: Entrepreneur[] = []) =>
                        old.map(e => e.id === id ? { ...e, ...updated } : e)
                    );
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
                changeStatus: async (id: string | number, status: 'active' | 'inactive') => {
                    const response = await axiosInstance.patch(`/dashboard/emprendedores/estado/${id}`, { status });
                    queryClient.setQueryData(['entrepreneurs'], (old: Entrepreneur[] = []) =>
                        old.map(e => e.id === id ? { ...e, status } : e)
                    );
                    return response.data;
                },
                search: async (query: string) => {
                    const response = await axiosInstance.get('/usuario/emprendedores/search', { params: { q: query } });
                    return response.data;
                }
            }
        }
    );
}