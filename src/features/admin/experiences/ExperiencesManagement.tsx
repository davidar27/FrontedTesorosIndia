// import { useQueryClient } from '@tanstack/react-query';
import GenericManagement from '@/components/admin/GenericManagent';
import useAuth from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { ExperienceCard } from '@/features/admin/experiences/ExperienceCard';
import { toast } from 'sonner';
import { EntityConfig } from '@/features/admin/types';
import { useExperiencesManagement } from '@/features/admin/experiences/useExperiencesManagement';

export default function ExperiencesManagement() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { hasPermission, isAdmin } = usePermissions();

    const canEdit = isAdmin() || hasPermission('experiencias:edit');
    const canDelete = isAdmin() || hasPermission('experiencias:delete');

    const {
        items: experiences,
        isLoading,
        error,
        update,
        delete: deleteExperience,
        changeStatus,
    } = useExperiencesManagement();

    // Configuración para GenericManagement
    const config: EntityConfig<Experience> = {
        entityName: 'Experiencia',
        entityNamePlural: 'Experiencias',
        searchPlaceholder: 'Buscar experiencias...',
        emptyStateEmoji: '🏠',
        emptyStateTitle: 'No hay experiencias',
        emptyStateDescription: 'Crea la primera experiencia para comenzar',
        description: 'Gestiona experiencias',
        items: experiences,
        isLoading: isLoading || authLoading,
        error: !isAuthenticated ? 'Debes iniciar sesión para acceder a esta página' : (typeof error === 'string' ? error : null),
        maxResults: 50,
        enableAnimations: true,
        showResultsCount: true,
        customFilters: () => null,
        searchFunction: (item, searchTerm) => {
            return item.name_experience.toLowerCase().includes(searchTerm.toLowerCase());
        },
        ItemCard: ExperienceCard,
        onUpdate: canEdit
            ? (item) => {
                update(item);
                toast.success('Experiencia actualizada exitosamente');
            }
            : () => {
                toast.error('No tienes permisos para editar experiencias');
            },
        onDelete: canDelete
            ? (id) => {
                if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
                    deleteExperience(id);
                    toast.success('Experiencia eliminada exitosamente');
                }
            }
            : () => {
                toast.error('No tienes permisos para eliminar experiencias');
            },
        onChangeStatus: (id, status) => {
            changeStatus(id, status);
            toast.success('Estado de la experiencia actualizado');
        }
    };

    return <GenericManagement<Experience> config={config} />;
}
