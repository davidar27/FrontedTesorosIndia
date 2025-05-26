import { EntityConfig, BaseEntity } from "../GenericManagent";

export const createEntrepreneursConfig = <T extends BaseEntity & { email: string; phone: string }>(
    items: T[],
    ItemCard: EntityConfig<T>['ItemCard'],
    callbacks: Pick<EntityConfig<T>, 'onEdit' | 'onDelete' | 'onView' | 'onCreate'>
): EntityConfig<T> => ({
    entityName: 'Emprendedor',
    entityNamePlural: 'Emprendedores',
    description: 'Gestiona los emprendedores y sus datos de contacto',
    searchPlaceholder: 'Buscar emprendedores, email, teléfono...',
    emptyStateEmoji: '👥',
    emptyStateTitle: 'No se encontraron emprendedores',
    emptyStateDescription: 'Intenta cambiar los filtros o el término de búsqueda',
    items,
    ItemCard,
    ...callbacks,
    searchFunction: (item, searchTerm) => {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term) ||
            item.email.toLowerCase().includes(term) ||
            item.phone.toLowerCase().includes(term);
    }
});