import { EntityConfig } from "@/features/admin/types";
import { EntrepreneursFilter } from "./EntrepreneursFilter";
import { Entrepreneur } from "./EntrepreneursTypes";

interface EntrepreneursConfigParams {
    data: Entrepreneur[];
    CardComponent: React.ComponentType<{
        item: Entrepreneur;
        onUpdate: (item: Entrepreneur) => void;
        onDelete: (id: number) => void;
        onChangeStatus: (id: number, status: string) => void;
        onRetry?: () => void;
    }>;
    actions: {
        onUpdate?: (item: Entrepreneur) => void;
        onDelete?: (id: number) => void;
        onCreate?: () => void;
        onChangeStatus?: (id: number, status: string) => void;
        onRetry?: () => void;
    };
}

const statusPriority = {
    active: 1,
    pending: 2,
    inactive: 3
};

function sortByStatus(a: Entrepreneur, b: Entrepreneur) {
    const getStatus = (e: Entrepreneur) => {
        const s = (e.status || '').toLowerCase();
        if (s === 'activo' || s === 'active') return 'active';
        if (s === 'pendiente' || s === 'pending') return 'pending';
        if (s === 'inactivo' || s === 'inactive') return 'inactive';
        return 'inactive';
    };
    return statusPriority[getStatus(a)] - statusPriority[getStatus(b)];
}

export const EntrepreneursConfig = ({
    data,
    CardComponent,
    actions
}: EntrepreneursConfigParams): EntityConfig<Entrepreneur> => ({
    entityName: "Emprendedor",
    entityNamePlural: "Emprendedores",
    searchPlaceholder: "Buscar emprendedores...",
    emptyStateEmoji: "👥",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay emprendedores",
    emptyStateDescription: "Crea el primer emprendedor para comenzar",
    description: "Gestiona emprendedores",
    items: data.sort(sortByStatus),
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
            entrepreneur.phone?.toLowerCase().includes(searchLower) ||
            entrepreneur.name_experience?.toLowerCase().includes(searchLower)
        );
    },
    onUpdate: actions.onUpdate || (() => {}),
    onDelete: actions.onDelete || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: actions.onRetry || (() => {}),
    onChangeStatus: actions.onChangeStatus || (() => {}),
});