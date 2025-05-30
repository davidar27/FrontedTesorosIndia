/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query';
import GenericManagement from '@/components/admin/GenericManagent';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useProtectedMutation } from '@/hooks/useProtectedMutation';
import { Farm } from '@/features/admin/farms/FarmTypes';
import { CreateFarmsConfig } from '@/features/admin/farms/createFarmsConfig';
import FarmCard  from '@/features/admin/farms/FamCard';
import { farmsApi } from '@/services/admin/farms';

export default function FarmsManagement() {
    const queryClient = useQueryClient();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Verificando autenticación...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Debes iniciar sesión para acceder a esta página</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Ir al Login
                </button>
            </div>
        );
    }

    const canEdit = isAdmin() || hasPermission('fincas:edit');
    const canDelete = isAdmin() || hasPermission('fincas:delete');

    const {
        data: farms = [],
        isLoading,
        error,
        refetch
    } = useAuthenticatedQuery<Farm[]>({
        queryKey: ['farms'],
        queryFn: () => farmsApi.getAllFarms(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 2
    });



    // const updateMutation = useProtectedMutation({
    //     mutationFn: ({ id, data }: { id: number; data: UpdateEntrepreneurData }) =>
    //         entrepreneursApi.update(id, data),
    //     requiredPermission: 'entrepreneurs:edit',
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
    //     },
    //     onError: (error: any) => {
    //         console.error('Error updating entrepreneur:', error);
    //     },
    //     onUnauthorized: () => {
    //         alert('No tienes permisos para editar emprendedores');
    //     }
    // });

    const deleteMutation = useProtectedMutation({
        mutationFn: farmsApi.deleteFarm,
        requiredPermission: 'fincas:delete',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farms'] });
        },
        onError: (error: any) => {
            console.error('Error deleting farm:', error);
        },
        onUnauthorized: () => {
            alert('No tienes permisos para eliminar fincas');
        }
    });

    const handleEdit = (farm: Farm) => {
        if (!canEdit) {
            alert('No tienes permisos para editar fincas');
            return;
        }
        console.log('Editing farm:', farm);
        // Aquí puedes abrir un modal de edición o navegar a una página de edición
    };

    const handleDelete = (farmId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta finca?')) {
            deleteMutation.mutate(farmId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando fincas...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error al cargar las fincas</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }
    const config = CreateFarmsConfig<Farm>({
        data: farms,
        CardComponent: FarmCard,
        actions: {
            onEdit: canEdit ? handleEdit : undefined,
            onDelete: canDelete ? handleDelete : undefined,
        }
    });

    return <GenericManagement<Farm> config={config} />
       
        
}
