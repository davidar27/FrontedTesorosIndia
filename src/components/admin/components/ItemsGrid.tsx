import { BaseEntity } from '@/features/admin/types';

interface ItemsGridProps<T extends BaseEntity<string>> {
    items: T[];
    ItemCard: React.ComponentType<{
        item: T;
        onUpdate: (item: T) => void;
        onChangeStatus: (id: number, status: string) => void;
    }>;
    onUpdate: (item: T) => void;
    onChangeStatus: (id: number, status: string) => void;
    enableAnimations?: boolean;
}   

export function ItemsGrid<T extends BaseEntity<string>>({
    items,
    ItemCard,
    onUpdate,
    onChangeStatus, 
    enableAnimations = true
}: ItemsGridProps<T>) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item, index) => (
                <div
                    key={`${item.id}-${item.name}-${item.email}-${item.phone}-${item.name}`}
                    className={enableAnimations ? "animate-fade-in-up" : ""}
                    style={enableAnimations ? {
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`
                    } : undefined}
                >
                    <ItemCard
                        key={`${item.id}-${item.name}-${item.email}-${item.phone}-${item.name}`}
                        item={item}
                        onUpdate={onUpdate}
                        onChangeStatus={onChangeStatus}
                    />
                </div>
            ))}
        </div>
    );
} 