import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Package, PackageStatus } from './PackageTypes';
import { normalizeStatus } from '../adminHelpers';

interface PackagesFilterProps {
    items: Package[];
    onFilterChange: (filteredItems: Package[]) => void;
}

export function PackagesFilter({ items, onFilterChange }: PackagesFilterProps) {
    const isPackageStatus = (status: string): status is PackageStatus =>
        ['active', 'inactive'].includes(status);
    return (
        <DefaultCustomFilters<Package>

            items={items.map(item => {
                const normalized = normalizeStatus(item.status);
                return {
                    ...item,
                    status: isPackageStatus(normalized) ? normalized : 'inactive'
                };
            })}
            onFilterChange={onFilterChange}
            type="package"
        />
    );
} 