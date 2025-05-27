import { EntityConfig, BaseEntity } from "@/components/admin/GenericManagent";

export const createFarmsConfig = <T extends BaseEntity & {
    entrepreneur: string;
    location: string;
    Type: string;
    status: string;
}>(
    items: T[],
    ItemCard: EntityConfig<T>['ItemCard'],
    callbacks: Pick<EntityConfig<T>, 'onEdit' | 'onDelete' | 'onCreate'>
): EntityConfig<T> => ({
    entityName: 'Finca',
    entityNamePlural: 'Fincas',
    description: 'Gestiona y monitorea las fincas de los emprendedores',
    searchPlaceholder: 'Buscar fincas, emprendedores, ubicaciones...',
    emptyStateEmoji: '🏔️',
    emptyStateTitle: 'No se encontraron fincas',
    emptyStateDescription: 'Intenta cambiar los filtros o el término de búsqueda para encontrar fincas',
    items,
    ItemCard,
    ...callbacks,
    searchFunction: (item, searchTerm) => {
        if (!searchTerm) return true;

        const term = searchTerm.toLowerCase().trim();
        const searchableFields = [
            item.name || '',
            item.entrepreneur || '',
            item.location || '',
            item.Type || '',
            item.status || ''
        ];

        return searchableFields.some(field =>
            field.toLowerCase().includes(term)
        );
    },
    // filterOptions: [
    //     {
    //         key: 'status',
    //         label: 'Estado',
    //         options: [
    //             { value: 'active', label: 'Activa' },
    //             { value: 'inactive', label: 'Inactiva' },
    //             { value: 'draft', label: 'Borrador' }
    //         ]
    //     },
    //     {
    //         key: 'Type',
    //         label: 'Tipo de Cultivo',
    //         options: [
    //             { value: 'Café Arábigo', label: 'Café Arábigo' },
    //             { value: 'Café Robusta', label: 'Café Robusta' },
    //             { value: 'Cacao', label: 'Cacao' },
    //             { value: 'Plátano', label: 'Plátano' }
    //         ]
    //     }
    // ]
});


