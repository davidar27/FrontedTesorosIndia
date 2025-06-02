import { BaseEntity } from '../../../features/admin/types';

// Función helper para obtener valor como string seguro
export const getStringValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
};

// Función de búsqueda por defecto mejorada
export const defaultSearchFunction = <T extends BaseEntity<string>>(item: T, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase().trim();

    // Campos predeterminados + campos dinámicos del objeto
    const searchableFields = [
        getStringValue(item.name),
        getStringValue(item.status),
        // Campos opcionales comunes
        getStringValue(item.description),
        getStringValue(item.email),
        getStringValue(item.phone),
        getStringValue(item.category),
        getStringValue(item.type),
        // Buscar en todos los campos string del objeto
        ...Object.values(item)
            .filter(value => typeof value === 'string' && value.length < 200) // Evitar campos muy largos
            .map(value => getStringValue(value))
    ];

    return searchableFields.some(field =>
        field && field.toLowerCase().includes(term)
    );
}; 