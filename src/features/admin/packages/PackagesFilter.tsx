import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Package } from './PackageTypes';
import { normalizeEntrepreneurStatus } from '../adminHelpers';

interface PackagesFilterProps {
    items: Package[];
    onFilterChange: (filteredItems: Package[]) => void;
}

export function PackagesFilter({ items, onFilterChange }: PackagesFilterProps) {
    return (
        <DefaultCustomFilters<Package>
            items={items.map(item => ({
                ...item,
                status: normalizeEntrepreneurStatus(item.status)
            }))}
            onFilterChange={onFilterChange}
        />
    );
} 