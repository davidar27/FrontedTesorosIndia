import { DefaultCustomFilters } from '@/components/admin/Filter';
import { Experience, Experiencestatus } from '@/features/admin/experiences/ExperienceTypes';
import { normalizeStatus } from '../adminHelpers';

interface ExperiencesFilterProps {
    items: Experience[];
    onFilterChange: (filteredItems: Experience[]) => void;
}

export function ExperiencesFilter({ items, onFilterChange }: ExperiencesFilterProps) {
    const isExperienceStatus = (status: string): status is Experiencestatus =>
        ['published', 'draft'].includes(status);
    return (
        <DefaultCustomFilters<Experience>

            items={items.map(item => {
                const normalized = normalizeStatus(item.status);
                return {
                    ...item,
                    status: isExperienceStatus(normalized) ? normalized : 'draft'
                };
            })}
            onFilterChange={onFilterChange}
            type="experience"
        />
    );
} 