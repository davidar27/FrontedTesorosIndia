import { EntityConfig } from "@/features/admin/types";
import { EntrepreneursFilter } from "./EntrepreneursFilter";
import { Entrepreneur } from "./EntrepreneursTypes";

interface CreateConfigParams {
    data: Entrepreneur[];
    CardComponent: React.ComponentType<{
        item: Entrepreneur;
        onEdit: (item: Entrepreneur) => void;
        onDelete: (id: number) => void;
    }>;
    actions: {
        onEdit?: (item: Entrepreneur) => void;
        onDelete?: (id: number) => void;
        onCreate?: () => void;
    };
}

export const CreateEntrepreneursConfig = ({
    data,
    CardComponent,
    actions
}: CreateConfigParams): EntityConfig<Entrepreneur> => ({
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
    customFilters: EntrepreneursFilter,
    searchFunction: (item, searchTerm) => {
        const searchLower = searchTerm.toLowerCase();
        const entrepreneur = item as Entrepreneur;
        return (
            entrepreneur.name?.toLowerCase().includes(searchLower) ||
            entrepreneur.email?.toLowerCase().includes(searchLower) ||
            entrepreneur.phone_number?.toLowerCase().includes(searchLower) ||
            entrepreneur.name_farm?.toLowerCase().includes(searchLower)
        );
    },
    onEdit: actions.onEdit || (() => {}),
    onDelete: actions.onDelete || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: () => {},
});