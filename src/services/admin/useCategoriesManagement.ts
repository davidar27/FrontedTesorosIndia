import { Category } from '@/features/admin/categories/CategoriesTypes';
import { useGenericApi } from '@/hooks/useGenericApi';


export function useCategoriesManagement() {

    return useGenericApi<Category, number>(
        {
            entityKey: 'category',
            endpoints: {
                getAll: '/dashboard/categorias',
                getById: (id) => `/dashboard/categoria/${id}`,
                create: '/dashboard/categoria/crear',
                update: (id) => `/dashboard/categoria/actualizar/${id}`,
                delete: (id) => `/dashboard/categorias/${id}`,
                changeStatus: (id) => `/dashboard/estado/categorias/${id}`,
                search: '/usuario/emprendedores/search',
            },
            
        }
    );
}

