import { Package } from '@/features/admin/packages/PackageTypes';
import { useGenericApi } from '@/hooks/useGenericApi';
import { useCallback } from 'react';

const packageApiOptions = {
    entityKey: 'packages',
    endpoints: {
        getAll: '/dashboard/paquetes/completos',
        getById: (id: number | string) => `dashboard/paquetes/${id}`,
        getDetails: '/dashboard/detalles',
        create: '/dashboard/paquetes',
        update: (id: number | string) => `/dashboard/actualizar/paquetes/${id}`,
        delete: (id: number | string) => `/dashboard/paquetes/${id}`,
        changeStatus: (id: number | string) => `/dashboard/estado/paquetes/${id}`,
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

