import { Package } from '@/features/admin/packages/PackageTypes';
import { useGenericApi } from '@/hooks/useGenericApi';
import { useCallback } from 'react';

const packageApiOptions = {
    entityKey: 'packages',
    endpoints: {
        getAll: '/dashboard/paquetes',
        getById: (id: number | string) => `/dashboard/paquete/${id}`,
        getDetails: '/dashboard/detalles',
        create: '/dashboard/paquetes/crear',
        update: (id: number | string) => `/dashboard/paquetes/actualizar/${id}`,
        delete: (id: number | string) => `/dashboard/paquetes/${id}`,
        changeStatus: (id: number | string) => `/dashboard/estado/paquetes/${id}`,
        search: '/usuario/paquetes/search',
    },
};

export function usePackagesManagement() {
    const genericApi = useGenericApi<Package, number>(packageApiOptions);

    const getDashboardDetails = useCallback(() => {
        return genericApi.customRequest<unknown>('getDetails', 'GET');
    }, [genericApi]);

    return {
        ...genericApi,
        getDashboardDetails,
    };
}

