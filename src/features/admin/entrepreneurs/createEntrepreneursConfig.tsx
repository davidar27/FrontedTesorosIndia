/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEntity, EntityConfig } from "@/components/admin/GenericManagent";

interface CreateConfigParams<T extends BaseEntity<any>> {
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

export const CreateEntrepreneursConfig = <T extends BaseEntity<any>>({
    data,
    CardComponent,
    actions
}: CreateConfigParams<T>): EntityConfig<T> => ({
    entityName: "Emprendedor",
    entityNamePlural: "Emprendedores",
    searchPlaceholder: "Buscar emprendedores...",
    emptyStateEmoji: "👥",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay emprendedores",
    emptyStateDescription: "Crea el primer emprendedor para comenzar",
    description: "Gestiona emprendedores",
    items: data,
    isLoading: false,
    error: null,
    maxResults: 50,
    enableAnimations: true,
    showResultsCount: true,
    customFilters: () => null,
    searchFunction: () => true,
    onEdit: actions.onEdit || (() => {}),
    onDelete: actions.onDelete || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: () => {},
});