import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Experience } from '@/features/admin/experiences/ExperienceTypes';
import { normalizeExperienceStatus } from '@/features/admin/adminHelpers';

interface ExperiencesFilterProps {
    items: Experience[];
    onFilterChange: (filteredItems: Experience[]) => void;
}

export function ExperiencesFilter({ items, onFilterChange }: ExperiencesFilterProps) {
    return (
        <DefaultCustomFilters<Experience>
            items={items.map(item => ({
                ...item,
                status: normalizeExperienceStatus(item.status)
            }))}
            onFilterChange={onFilterChange}
        />
    );
} 