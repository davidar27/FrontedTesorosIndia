import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Entrepreneur } from './EntrepreneursTypes';
import { normalizeEntrepreneurStatus } from '../adminHelpers';

interface EntrepreneursFilterProps {
    items: Entrepreneur[];
    onFilterChange: (filteredItems: Entrepreneur[]) => void;
}

export function EntrepreneursFilter({ items, onFilterChange }: EntrepreneursFilterProps) {
    return (
        <DefaultCustomFilters<Entrepreneur>
            items={items.map(item => ({
                ...item,
                status: normalizeEntrepreneurStatus(item.status)
            }))}
            onFilterChange={onFilterChange}
        />
    );
} 