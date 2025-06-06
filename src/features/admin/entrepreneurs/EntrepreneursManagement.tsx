import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { EntrepreneurCard } from '@/features/admin/entrepreneurs/EntrepreneursCard';
import { CreateEntrepreneurForm } from '@/features/admin/entrepreneurs/CreateEntrepreneurForm';
import { EntrepreneursConfig } from '@/features/admin/entrepreneurs/EntrepreneursConfig';
import { entrepreneursApi } from '@/services/admin/entrepernaur';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useProtectedMutation } from '@/hooks/useProtectedMutation';
import { Entrepreneur, CreateEntrepreneurData } from '@/features/admin/entrepreneurs/EntrepreneursTypes';
import { normalizeStatus } from '@/features/admin/entrepreneurs/normalizeStatus';


export default function EntrepreneursManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const queryClient = useQueryClient();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();
    
    const canCreate = isAdmin() || hasPermission('entrepreneurs:create');
    const canDelete = isAdmin() || hasPermission('entrepreneurs:delete');

    const {
        data: entrepreneurs = [],
        isLoading,
        error,
        refetch
    } = useAuthenticatedQuery<Entrepreneur[]>({
        queryKey: ['entrepreneurs'],
        queryFn: async () => {
            const data = await entrepreneursApi.getAll();
            return data;
        },
        staleTime: 5 * 60 * 1000, 
        retry: 1
    });

    const createMutation = useProtectedMutation({
        mutationFn: entrepreneursApi.create,
        requiredPermission: 'entrepreneurs:create',
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
            setShowCreateForm(false);
            toast.success('Emprendedor creado exitosamente');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onUnauthorized: () => {
            toast.error('No tienes permisos para crear emprendedores');
        }
    });

    const statusMutation = useProtectedMutation({
        mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
            entrepreneursApi.changeStatus(id, status),
        onSuccess: (data, variables) => {
            queryClient.setQueryData<Entrepreneur[]>(['entrepreneurs'], (old) => {
                if (!old) return old;
                return old.map(e =>
                    e.id === variables.id
                        ? { ...e, status: normalizeStatus(data.status) }
                        : e
                );
            });
            toast.success('Estado del emprendedor actualizado exitosamente');
        },
        onError: (error: Error) => {
            toast.error('Error al cambiar el estado del emprendedor: ' + error.message);
        }
    });

    const deleteMutation = useProtectedMutation({
        mutationFn: (id: number) => entrepreneursApi.delete(id),
        requiredPermission: 'entrepreneurs:delete',
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
            toast.success('Emprendedor eliminado exitosamente');
        },
        onError: (error: Error) => {
            toast.error('Error al eliminar el emprendedor: ' + error.message);
        },
        onUnauthorized: () => {
            toast.error('No tienes permisos para eliminar emprendedores');
        }
    });

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

    const handleEdit = (id: number, updatedFields: Partial<Entrepreneur>) => {
        if (updatedFields.image) {
            updatedFields.image = `${updatedFields.image}?t=${Date.now()}`;
        }
        queryClient.setQueryData<Entrepreneur[]>(['entrepreneurs'], (old) => {
            if (!old) return old;
            return old.map(e =>
                e.id === id
                    ? { ...e, ...updatedFields }
                    : e
            );
        });
    };

    const handleCreate = () => {
        if (!canCreate) {
            toast.error('No tienes permisos para crear emprendedores');
            return;
        }
        setShowCreateForm(true);
    };

    const handleCreateSubmit = (data: CreateEntrepreneurData) => {
        toast.promise(
            createMutation.mutateAsync(data),
            {
                loading: 'Creando emprendedor...',
                success: 'Emprendedor creado exitosamente',
                error: (err) => err.message
            }
        );
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleStatusChange = (id: number, status: 'active' | 'inactive') => {
        toast.promise(
            statusMutation.mutateAsync({ id, status }),
            {
                loading: 'Cambiando estado del emprendedor...',
                success: 'Estado del emprendedor actualizado exitosamente',
                error: 'Error al cambiar el estado del emprendedor'
            }
        );
    };

    const handleDelete = (entrepreneurId: number) => {
        if (!canDelete) {
            toast.error('No tienes permisos para eliminar emprendedores');
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres eliminar este emprendedor? Esta acción no se puede deshacer.')) {
            deleteMutation.mutate(entrepreneurId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando emprendedores...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error al cargar los emprendedores</p>
                <button
                    onClick={() => {
                        toast.promise(
                            refetch(),
                            {
                                loading: 'Recargando datos...',
                                success: 'Datos actualizados exitosamente',
                                error: 'Error al recargar los datos'
                            }
                        );
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const config = EntrepreneursConfig({
        data: entrepreneurs,
        CardComponent: (props) => (
            <EntrepreneurCard
                {...props}
                key={`${props.item.id}-${props.item.name}-${props.item.email}-${props.item.phone}-${props.item.name_experience}`}
                onEdit={handleEdit}
                onDisable={() => handleStatusChange(props.item.id!, 'inactive')}
                onActivate={() => handleStatusChange(props.item.id!, 'active')}
                onDelete={canDelete ? handleDelete : () => {}}
                refetch={refetch}
            />
        ),
        actions: {
            onCreate: canCreate ? handleCreate : undefined
        }
    });

    return (
        <>
            {showCreateForm ? (
                <CreateEntrepreneurForm
                    onSubmit={handleCreateSubmit}
                    onCancel={handleCancelCreate}
                    isLoading={createMutation.isPending}
                />
            ) : (
                <GenericManagement<Entrepreneur> config={config} />
            )}
        </>
    );
}