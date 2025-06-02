import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

export default function EntrepreneursManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const queryClient = useQueryClient();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();
    
    const canCreate = isAdmin() || hasPermission('entrepreneurs:create');
    const canEdit = isAdmin() || hasPermission('entrepreneurs:edit');
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
        retry: 2
    });


    const createMutation = useProtectedMutation({
        mutationFn: entrepreneursApi.create,
        requiredPermission: 'entrepreneurs:create',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
            setShowCreateForm(false);
        },
        onError: (error: Error) => {
            console.error('Error creating entrepreneur:', error);
        },
        onUnauthorized: () => {
            alert('No tienes permisos para crear emprendedores');
        }
    });

    const deleteMutation = useProtectedMutation({
        mutationFn: entrepreneursApi.delete,
        requiredPermission: 'entrepreneurs:delete',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
        },
        onError: (error: Error) => {
            console.error('Error deleting entrepreneur:', error);
        },
        onUnauthorized: () => {
            alert('No tienes permisos para eliminar emprendedores');
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

    const handleEdit = (entrepreneur: Entrepreneur) => {
        if (!canEdit) {
            alert('No tienes permisos para editar emprendedores');
            return;
        }
        console.log('Editing entrepreneur:', entrepreneur);
    };

    const handleDelete = (entrepreneurId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este emprendedor?')) {
            deleteMutation.mutate(entrepreneurId);
        }
    };

    const handleCreate = () => {
        setShowCreateForm(true);
    };

    const handleCreateSubmit = (data: CreateEntrepreneurData) => {
        createMutation.mutate(data);
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
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
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const config = EntrepreneursConfig({
        data: entrepreneurs,
        CardComponent: EntrepreneurCard,
        actions: {
            onEdit: canEdit ? handleEdit : undefined,
            onDelete: canDelete ? handleDelete : undefined,
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