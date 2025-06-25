import { EntityConfig } from "@/features/admin/types";
import { Package } from "./PackageTypes";
import { PackagesFilter } from "./PackagesFilter";

interface PackagesConfigParams {
    data: Package[];
    CardComponent: React.ComponentType<{
        item: Package;
        onUpdate: (item: Package) => void;
        onChangeStatus: (id: number, status: string) => void;
        onRetry?: () => void;
    }>;
    actions: {
        onUpdate?: (item: Package) => void;
        onCreate?: () => void;
        onChangeStatus?: (id: number, status: string) => void;
        onRetry?: () => void;
    };
}

const statusPriority = {
    active: 1,
    inactive: 3
};

function sortByStatus(a: Package, b: Package) {
    const getStatus = (e: Package) => {
        const s = (e.status || '').toLowerCase();
        if (s === 'activo' || s === 'active') return 'active';
        if (s === 'inactivo' || s === 'inactive') return 'inactive';
        return 'inactive';
    };
    return statusPriority[getStatus(a)] - statusPriority[getStatus(b)];
}

export const PackagesConfig = ({
    data,
    CardComponent,
    actions
}: PackagesConfigParams): EntityConfig<Package> => ({
    entityName: "Paquete",
    entityNamePlural: "Paquetes",
    searchPlaceholder: "Buscar paquetes...",
    emptyStateEmoji: "📦",
    ItemCard: CardComponent,
    emptyStateTitle: "No hay paquetes",
    emptyStateDescription: "Crea el primer paquete para comenzar",
    description: "Gestiona paquetes",
    items: data.sort(sortByStatus),
    isLoading: false,
    error: null,
    maxResults: 50,
    enableAnimations: true,
    showResultsCount: true,
    customFilters: PackagesFilter,
    searchFunction: (item, searchTerm) => {
        const searchLower = searchTerm.toLowerCase();
        const p = item as Package;
        return (
            p.name?.toLowerCase().includes(searchLower) ||
            p.price?.toString().includes(searchLower) ||
            p.duration?.toLowerCase().includes(searchLower) ||
            p.capacity?.toLowerCase().includes(searchLower) ||
            p.joinDate?.toLowerCase().includes(searchLower)
        );
    },
    onUpdate: actions.onUpdate || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: actions.onRetry || (() => {}),
    onChangeStatus: actions.onChangeStatus || (() => {}),
});