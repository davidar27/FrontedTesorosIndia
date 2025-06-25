import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Entrepreneur, EntrepreneurStatus } from './EntrepreneursTypes';
import { normalizeStatus } from '../adminHelpers';

interface EntrepreneursFilterProps {
    items: Entrepreneur[];
    onFilterChange: (filteredItems: Entrepreneur[]) => void;
}

export function EntrepreneursFilter({ items, onFilterChange }: EntrepreneursFilterProps) {
    const isEntrepreneurStatus = (status: string): status is EntrepreneurStatus =>
        ['active', 'inactive'].includes(status);
    return (
        <DefaultCustomFilters<Entrepreneur>
            items={items.map(item => {
                const normalized = normalizeStatus(item.status);
                return {
                    ...item,
                    status: isEntrepreneurStatus(normalized) ? normalized : 'inactive'
                };
            })}
            onFilterChange={onFilterChange}
            type="entrepreneur"
        />
    );
} 