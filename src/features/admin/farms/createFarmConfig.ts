import { BaseEntity, EntityConfig } from "@/features/admin/types";

type ValidStatus = 'active' | 'inactive' | 'draft' | 'pending';

interface CreateConfigParams<T extends BaseEntity<ValidStatus>> {
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

const CreateFarmsConfig = <T extends BaseEntity<ValidStatus>>({
    data,
    CardComponent,
    actions
}: CreateConfigParams<T>): EntityConfig<T> => ({
    entityName: "Finca",
    entityNamePlural: "Fincas",
    searchPlaceholder: "Buscar fincas...",
    emptyStateEmoji: "🏠",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay fincas",
    emptyStateDescription: "Crea la primera finca para comenzar",
    description: "Gestiona fincas",
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

export default CreateFarmsConfig;