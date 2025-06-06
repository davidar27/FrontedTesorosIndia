import { BaseEntity } from '@/features/admin/types';

interface ItemsGridProps<T extends BaseEntity<string>> {
    items: T[];
    ItemCard: React.ComponentType<{
        item: T;
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
        onActivate: (id: number) => void;
        onDisable: (id: number) => void;
    }>;
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    onActivate: (id: number) => void;
    onDisable: (id: number) => void;
    enableAnimations?: boolean;
}

export function ItemsGrid<T extends BaseEntity<string>>({
    items,
    ItemCard,
    onEdit,
    onDelete,
    onActivate,
    onDisable,
    enableAnimations = true
}: ItemsGridProps<T>) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item, index) => (
                <div
                    key={`${item.id}-${item.name}-${item.email}-${item.phone}-${item.name_experience}`}
                    className={enableAnimations ? "animate-fade-in-up" : ""}
                    style={enableAnimations ? {
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`
                    } : undefined}
                >
                    <ItemCard
                        key={`${item.id}-${item.name}-${item.email}-${item.phone}-${item.name_experience}`}
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onActivate={onActivate}
                        onDisable={onDisable}
                    />
                </div>
            ))}
        </div>
    );
} 