import { EntityConfig } from "@/features/admin/types";
import { Package } from "./PackageTypes";
import { PackageCardWrapper } from "./PackageCardWrapper";

interface PackagesConfigParams {
    data: Package[];
    actions: {
        onUpdate?: (item: Package) => void;
        onDelete?: (id: number) => void;
        onCreate?: () => void;
    };
}

export const createPackagesConfig = ({
    data,
    actions
}: PackagesConfigParams): EntityConfig<Package> => ({
    entityName: 'Paquete',
    entityNamePlural: 'Paquetes',
    description: 'Gestiona los paquetes de productos y sus precios',
    searchPlaceholder: 'Buscar paquetes, descripción...',
    emptyStateEmoji: '📦',
    emptyStateTitle: 'No se encontraron paquetes',
    emptyStateDescription: 'Intenta cambiar los filtros o el término de búsqueda',
    items: data,
    ItemCard: PackageCardWrapper,
    onUpdate: actions.onUpdate || (() => {}),
    onDelete: actions.onDelete || (() => {}),
    onCreate: actions.onCreate || (() => {}),
    onRetry: () => {},
    searchFunction: (item, searchTerm) => {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term) ||
            (item.description?.toLowerCase().includes(term) ?? false);
    }
});