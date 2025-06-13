import { BaseEntity, EntityConfig } from "@/features/admin/types";
import { Experiencestatus } from "@/features/admin/experiences/ExperienceTypes";

interface CreateConfigParams<T extends BaseEntity<Experiencestatus>> {
    data: T[];
    CardComponent: React.ComponentType<{
        item: T;
        onUpdate: (item: T) => void;
        onChangeStatus: (id: number, status: string) => void;
    }>;
    actions: {
        onUpdate?: (item: T) => void;
        onChangeStatus?: (id: number, status: string) => void;
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
    onUpdate: actions.onUpdate || (() => { }),
    onChangeStatus: actions.onChangeStatus || (() => { }),
    onRetry: () => { },
});

export default CreateExperiencesConfig;