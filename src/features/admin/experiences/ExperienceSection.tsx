import { useQueryClient } from '@tanstack/react-query';
import GenericManagement from '@/components/admin/GenericManagent';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useProtectedMutation } from '@/hooks/useProtectedMutation';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { ExperiencesApi } from '@/services/admin/experiences';
import ExperienceCard from '@/features/admin/experiences/ExperienceCard'
import CreateExperiencesConfig from '@/features/admin/experiences/CreateExperiencesConfig';
import { toast } from 'sonner';

export default function ExperiencesManagement() {
    const queryClient = useQueryClient();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();

    const canEdit = isAdmin() || hasPermission('experiencias:edit');
    const canDelete = isAdmin() || hasPermission('experiencias:delete');

    const {
        data: Experiences = [],
        isLoading,
        error,
        refetch
    } = useAuthenticatedQuery<Experience[]>({
        queryKey: ['Experiences'],
        queryFn: () => ExperiencesApi.getAllExperiences(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 2
    });

    const deleteMutation = useProtectedMutation({
        mutationFn: ExperiencesApi.deleteExperience,
        requiredPermission: 'experiencias:delete',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Experiences'] });
            queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
            toast.success('Experiencia desactivada exitosamente');
        },
        onError: (error: Error) => {
            console.error('Error deleting Experience:', error);
            toast.error('Error al desactivar la experiencia: ' + error.message);
        },
        onUnauthorized: () => {
            alert('No tienes permisos para eliminar experiencias');
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

    const handleEdit = (Experience: Experience) => {
        if (!canEdit) {
            alert('No tienes permisos para editar experiencias');
            return;
        }
        console.log('Editing Experience:', Experience);
    };

    const handleDelete = (experienceId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
            deleteMutation.mutate(experienceId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando experiencias...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">Error al cargar las experiencias</p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const config = CreateExperiencesConfig<Experience>({
        data: Experiences,
        CardComponent: ExperienceCard,
        actions: {
            onEdit: canEdit ? handleEdit : undefined,
            onDelete: canDelete ? handleDelete : undefined,
        }
    });

    return <GenericManagement<Experience> config={config} />;
}
