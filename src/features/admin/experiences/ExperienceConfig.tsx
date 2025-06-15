import { EntityConfig } from "@/features/admin/types";
import { ExperiencesFilter } from "@/features/admin/experiences/ExperiencesFilter";
import { Experience } from "@/features/admin/experiences/ExperienceTypes";

interface ExperiencesConfigParams {
    data: Experience[];
    CardComponent: React.ComponentType<{
        item: Experience;
        onUpdate: (item: Experience) => void;
        onChangeStatus: (id: number, status: string) => void;
        onRetry?: () => void;
    }>;
    actions: {
        onUpdate?: (item: Experience) => void;
        onCreate?: () => void;
        onChangeStatus?: (id: number, status: string) => void;
        onRetry?: () => void;
    };
}

const statusPriority = {
    active: 1,
    inactive: 2
};

function sortByStatus(a: Experience, b: Experience) {
    const getStatus = (e: Experience) => {
        const s = (e.status || '').toLowerCase();
        if (s === 'activo' || s === 'active') return 'active';
        if (s === 'inactivo' || s === 'inactive') return 'inactive';
        return 'inactive';
    };
    return statusPriority[getStatus(a)] - statusPriority[getStatus(b)];
}

export const ExperiencesConfig = ({
    data,
    CardComponent,
    actions
}: ExperiencesConfigParams): EntityConfig<Experience> => ({
    entityName: "Experiencia",
    entityNamePlural: "Experiencias",
    searchPlaceholder: "Buscar experiencias...",
    emptyStateEmoji: "�‍💻",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay experiencias",
    emptyStateDescription: "Crea la primera experiencia para comenzar",
    description: "Gestiona experiencias",
    items: data.sort(sortByStatus),
    isLoading: false,
    error: null,
    maxResults: 50,
    enableAnimations: true,
    showResultsCount: true,
    customFilters: ExperiencesFilter,
    searchFunction: (item, searchTerm) => {
        const searchLower = searchTerm.toLowerCase();
        const experience = item as Experience;
        return (
            experience.name?.toLowerCase().includes(searchLower) 
        );
    },
    onUpdate: actions.onUpdate || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: actions.onRetry || (() => {}),
    onChangeStatus: actions.onChangeStatus || (() => {}),
});