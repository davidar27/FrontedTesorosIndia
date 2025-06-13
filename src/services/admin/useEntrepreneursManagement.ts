import { Entrepreneur } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { useGenericApi } from '@/hooks/useGenericApi';


export function useEntrepreneursManagement() {

    return useGenericApi<Entrepreneur, number>(
        {
            entityKey: 'entrepreneurs',
            endpoints: {
                getAll: '/dashboard/emprendedores',
                getById: (id) => `/dashboard/emprendedor/${id}`,
                create: '/dashboard/emprendedores/crear',
                update: (id) => `/dashboard/actualizar/emprendedores/${id}`,
                delete: (id) => `/dashboard/emprendedores/${id}`,
                changeStatus: (id) => `/dashboard/estado/${id}`,
                search: '/usuario/emprendedores/search',
            },
            
        }
    );
}

