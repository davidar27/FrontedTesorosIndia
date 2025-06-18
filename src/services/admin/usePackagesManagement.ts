import { Package } from '@/features/admin/packages/PackageTypes';
import { useGenericApi } from '@/hooks/useGenericApi';


export function usePackagesManagement() {

    return useGenericApi<Package, number>(
        {
            entityKey: 'packages',
            endpoints: {
                getAll: '/dashboard/paquetes',
                getById: (id) => `/dashboard/paquete/${id}`,
                create: '/dashboard/paquetes/crear',
                update: (id) => `/dashboard/paquetes/actualizar/${id}`,
                delete: (id) => `/dashboard/paquetes/${id}`,
                changeStatus: (id) => `/dashboard/estado/paquetes/${id}`,
                search: '/usuario/paquetes/search',
            },

        }
    );
}

