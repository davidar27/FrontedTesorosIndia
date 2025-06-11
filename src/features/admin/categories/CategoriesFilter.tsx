import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Category } from './CategoriesTypes';
import { normalizeEntrepreneurStatus } from '../adminHelpers';

interface CategoriesFilterProps {
    items: Category[];
    onFilterChange: (filteredItems: Category[]) => void;
}

export function CategoriesFilter({ items, onFilterChange }: CategoriesFilterProps) {
    return (
        <DefaultCustomFilters<Category>
            items={items.map(item => ({
                ...item,
                status: normalizeEntrepreneurStatus(item.status)
            }))}
            onFilterChange={onFilterChange}
        />
    );
} 