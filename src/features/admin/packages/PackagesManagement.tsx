import { useQueryClient } from '@tanstack/react-query';
import GenericManagement from '@/components/admin/GenericManagent';
import { createPackagesConfig } from '@/features/admin/packages/createPackagesConfig';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useProtectedMutation } from '@/hooks/useProtectedMutation';
import { Package } from './PackageTypes';
import { packagesApi } from '@/services/admin/packages';

function PackagesManagement() {
    const queryClient = useQueryClient();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();
    
    const canEdit = isAdmin() || hasPermission('packages:edit');
    const canDelete = isAdmin() || hasPermission('packages:delete');

    const {
        data: packages = [],
        isLoading,
        error,
        refetch
    } = useAuthenticatedQuery<Package[]>({
        queryKey: ['packages'],
        queryFn: () => packagesApi.getAllPackages(),
        staleTime: 5 * 60 * 1000,
        retry: 2
    });

    const deleteMutation = useProtectedMutation({
        mutationFn: packagesApi.deletePackage,
        requiredPermission: 'packages:delete',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
        onError: (error: Error) => {
            console.error('Error deleting package:', error);
        },
        onUnauthorized: () => {
            alert('No tienes permisos para eliminar paquetes');
        }
    });

    const handleEdit = (pkg: Package) => {
        if (!canEdit) {
            alert('No tienes permisos para editar paquetes');
            return;
        }
        console.log('Editing package:', pkg);
    };

    const handleDelete = (packageId: number) => {
        if (!canDelete) {
            alert('No tienes permisos para eliminar paquetes');
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
            deleteMutation.mutate(packageId);
        }
    };

    const handleCreate = () => {
        console.log('Creating new package');
    };

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
                    onClick={() => window.location.href = '/auth/iniciar-sesion'}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Ir al Login
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando paquetes...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error al cargar los paquetes</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const config = createPackagesConfig({
        data: packages,
        actions: {
            onEdit: canEdit ? handleEdit : undefined,
            onDelete: canDelete ? handleDelete : undefined,
            onCreate: handleCreate
        }
    });

    return <GenericManagement config={config} />;
}

export default PackagesManagement;
