import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Entrepreneur } from './EntrepreneursTypes';
import { normalizeStatus } from './normalizeStatus';

interface EntrepreneursFilterProps {
    items: Entrepreneur[];
    onFilterChange: (filteredItems: Entrepreneur[]) => void;
}

export function EntrepreneursFilter({ items, onFilterChange }: EntrepreneursFilterProps) {
    return (
        <DefaultCustomFilters<Entrepreneur>
            items={items.map(item => ({
                ...item,
                status: normalizeStatus(item.status)
            }))}
            onFilterChange={onFilterChange}
        />
    );
} 