import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Entrepreneur } from './EntrepreneursTypes';

interface EntrepreneursFilterProps {
    items: Entrepreneur[];
    onFilterChange: (filteredItems: Entrepreneur[]) => void;
}

export function EntrepreneursFilter({ items, onFilterChange }: EntrepreneursFilterProps) {
    return (
        <DefaultCustomFilters<Entrepreneur>
            items={items}
            onFilterChange={onFilterChange}
        />
    );
} 