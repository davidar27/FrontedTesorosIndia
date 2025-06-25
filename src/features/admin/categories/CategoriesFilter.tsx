import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Category, CategoryStatus } from './CategoriesTypes';
import { normalizeStatus } from '../adminHelpers';

interface CategoriesFilterProps {
    items: Category[];
    onFilterChange: (filteredItems: Category[]) => void;
}

export function CategoriesFilter({ items, onFilterChange }: CategoriesFilterProps) {
    const isCategoryStatus = (status: string): status is CategoryStatus =>
        ['active', 'inactive'].includes(status);
    return (
        <DefaultCustomFilters<Category>
            items={items.map(item => {
                const normalized = normalizeStatus(item.status);
                return {
                    ...item,
                    status: isCategoryStatus(normalized) ? normalized : 'inactive'
                };
            })}
            onFilterChange={onFilterChange}
            type="category"
        />
    );
} 