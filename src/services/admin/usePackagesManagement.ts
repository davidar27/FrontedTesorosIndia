import { Package } from '@/features/admin/packages/PackageTypes';
import { useGenericApi } from '@/hooks/useGenericApi';
import { useCallback } from 'react';

const packageApiOptions = {
    entityKey: 'packages',
    endpoints: {
        getAll: '/dashboard/paquetes',
        getById: (id: string | string) => `/dashboard/paquete/${id}`,
        getDetails: '/dashboard/detalles',
        create: '/dashboard/paquetes/crear',
        update: (id: string | string) => `/dashboard/paquetes/actualizar/${id}`,
        delete: (id: string | string) => `/dashboard/paquetes/${id}`,
        changeStatus: (id: string | string) => `/dashboard/estado/paquetes/${id}`,
        search: '/usuario/paquetes/search',
    },
};

export function usePackagesManagement() {
    const genericApi = useGenericApi<Package, number>(packageApiOptions);

    const getDashboardDetails = useCallback(() => {
        return genericApi.customRequest<unknown>('getDetails', 'GET');
    }, []);

    return {
        ...genericApi,
        getDashboardDetails,
    };
}

