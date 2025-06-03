/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/api/axiosInstance';
import { Category } from '@/features/admin/categories/CategoriesTypes';

interface CategoryResponse {
    id: number;
    name: string;
    status: 'active' | 'inactive' | 'draft' | 'pending';
    productsCount: number;
}

const mapToCategory = (cat: CategoryResponse): Category => ({
    id: cat.id,
    name: cat.name,
    status: cat.status,
    productsCount: cat.productsCount
});

export const categoriesApi = {
    getAllCategories: async (): Promise<Category[]> => {
        try {
            const response = await axiosInstance.get<CategoryResponse[]>('dashboard/categorias');
            if (!response.data || !Array.isArray(response.data)) {
                console.log('No categories data found in response');
                return [];
            }
            return response.data.map(mapToCategory);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            throw new Error('Error al obtener las categorías');
        }
    },

    getCategoryById: async (id: number): Promise<Category> => {
        try {
            const response = await axiosInstance.get<CategoryResponse>(`/dashboard/categorias/${id}`);
            return mapToCategory(response.data);
        } catch (error) {
            console.error('Error fetching category:', error);
            throw new Error('Error al obtener la categoría');
        }
    },

    createCategory: async (data: Omit<Category, 'id' | 'status'>): Promise<Category> => {
        try {
            const response = await axiosInstance.post<CategoryResponse>('/dashboard/categorias/crear', data);
            return mapToCategory(response.data);
        } catch (error) {
            console.error('Error creating category:', error);
            throw new Error('Error al crear la categoría');
        }
    },

    updateCategory: async (id: number, data: Partial<Category>): Promise<Category> => {
        try {
            const response = await axiosInstance.put<CategoryResponse>(`/dashboard/categorias/${id}`, data);
            return mapToCategory(response.data);
        } catch (error) {
            console.error('Error updating category:', error);
            throw new Error('Error al actualizar la categoría');
        }
    },

    disableCategory: async (id: number): Promise<void> => {
        try {
            await axiosInstance.put(`/dashboard/categorias/desactivar/${id}`);
        } catch (error) {
            console.error('Error disabling category:', error);
            throw new Error('Error al Desactivar la categoría');
        }
    }
}; 