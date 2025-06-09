// import { useQueryClient } from '@tanstack/react-query';
import GenericManagement from '@/components/admin/GenericManagent';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery';
import { useProtectedMutation } from '@/hooks/useProtectedMutation';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { ExperiencesApi } from '@/services/admin/experiences';
import { ExperienceCard } from '@/features/admin/experiences/ExperienceCard';
import { toast } from 'sonner';
import { EntityConfig } from '@/features/admin/types';

export default function ExperiencesManagement() {
    // const queryClient = useQueryClient();
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
            // queryClient.invalidateQueries({ queryKey: ['Experiences'] });
            // queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
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

    // Configuración para GenericManagement
    const config: EntityConfig<Experience> = {
        entityName: 'Experiencia',
        entityNamePlural: 'Experiencias',
        searchPlaceholder: 'Buscar experiencias...',
        emptyStateEmoji: '🏠',
        emptyStateTitle: 'No hay experiencias',
        emptyStateDescription: 'Crea la primera experiencia para comenzar',
        description: 'Gestiona experiencias',
        items: Experiences,
        isLoading: isLoading || authLoading,
        error: !isAuthenticated ? 'Debes iniciar sesión para acceder a esta página' : (typeof error === 'string' ? error : null),
        maxResults: 50,
        enableAnimations: true,
        showResultsCount: true,
        customFilters: () => null,
        searchFunction: () => true,
        ItemCard: ExperienceCard,
        onUpdate: canEdit
            ? () => {
                // Aquí puedes abrir un modal o navegar a la edición, según tu lógica
                toast.info('Funcionalidad de edición no implementada');
            }
            : () => {
                toast.error('No tienes permisos para editar experiencias');
            },
        onDelete: canDelete
            ? (id) => {
                if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
                    deleteMutation.mutate(id);
                }
            }
            : () => {
                toast.error('No tienes permisos para eliminar experiencias');
            },
        onChangeStatus: () => {},
        onRetry: refetch,
    };

    return <GenericManagement<Experience> config={config} />;
}
