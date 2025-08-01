import { BaseEntity } from '@/features/admin/types';


export const getStringValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
};

export const defaultSearchFunction = <T extends BaseEntity<string>>(item: T, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase().trim();


    const searchableFields = [
        getStringValue(item.name),
        getStringValue(item.status),

        getStringValue(item.description),
        getStringValue(item.email),
        getStringValue(item.phone),
        getStringValue(item.category),
        getStringValue(item.type),

        ...Object.values(item)
            .filter(value => typeof value === 'string' && value.length < 200)
            .map(value => getStringValue(value))
    ];

    return searchableFields.some(field =>
        field && field.toLowerCase().includes(term)
    );
}; 