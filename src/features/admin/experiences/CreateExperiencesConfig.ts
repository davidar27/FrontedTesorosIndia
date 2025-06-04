import { BaseEntity, EntityConfig } from "@/features/admin/types";
import { Experiencestatus } from "@/features/admin/experiences/ExperienceTypes";

interface CreateConfigParams<T extends BaseEntity<Experiencestatus>> {
    data: T[];
    CardComponent: React.ComponentType<{
        item: T;
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
    }>;
    actions: {
        onEdit?: (item: T) => void;
        onDelete?: (id: number) => void;
        onCreate?: () => void;
    };
}

const CreateExperiencesConfig = <T extends BaseEntity<Experiencestatus>>({
    data,
    CardComponent,
    actions
}: CreateConfigParams<T>): EntityConfig<T> => ({
    entityName: "Experiencia",
    entityNamePlural: "Experiencias",
    searchPlaceholder: "Buscar experiencias...",
    emptyStateEmoji: "🏠",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay experiencias",
    emptyStateDescription: "Crea la primera experiencia para comenzar",
    description: "Gestiona experiencias",
    items: data,
    isLoading: false,
    error: null,
    maxResults: 50,
    enableAnimations: true,
    showResultsCount: true,
    customFilters: () => null,
    searchFunction: () => true,
    onEdit: actions.onEdit || (() => { }),
    onDelete: actions.onDelete || (() => { }),
    onCreate: actions.onCreate || (() => { }),
    onRetry: () => { },
});

export default CreateExperiencesConfig;