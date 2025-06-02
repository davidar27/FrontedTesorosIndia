import { BaseEntity } from '../../../features/admin/types';

interface ItemsGridProps<T extends BaseEntity<string>> {
    items: T[];
    ItemCard: React.ComponentType<{
        item: T;
        onEdit: (item: T) => void;
        onDelete: (id: number) => void;
    }>;
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    enableAnimations?: boolean;
}

export function ItemsGrid<T extends BaseEntity<string>>({
    items,
    ItemCard,
    onEdit,
    onDelete,
    enableAnimations = true
}: ItemsGridProps<T>) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item, index) => (
                <div
                    key={`${item.id}-${item.name}-${index}`}
                    className={enableAnimations ? "animate-fade-in-up" : ""}
                    style={enableAnimations ? {
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`
                    } : undefined}
                >
                    <ItemCard
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            ))}
        </div>
    );
} 