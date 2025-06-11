import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useGenericApi } from '@/hooks/useGenericApi';


export function useCategoriesManagement() {

    return useGenericApi<Entrepreneur, number>(
        {
            entityKey: 'category',
            endpoints: {
                getAll: '/dashboard/categorias',
                getById: (id) => `/dashboard/categoria/${id}`,
                create: '/dashboard/categoria/crear',
                update: (id) => `/dashboard/categoria/actualizar/${id}`,
                delete: (id) => `/dashboard/categorias/${id}`,
                changeStatus: (id) => `/dashboard/estado/${id}`,
                search: '/usuario/emprendedores/search',
            },
            
        }
    );
}

