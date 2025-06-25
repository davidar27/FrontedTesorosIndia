import { BaseEntity } from '@/features/admin/types';
import { useState, useEffect } from 'react';

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
    const [editingCardId, setEditingCardId] = useState<number | null>(null);

    useEffect(() => {
        const handleEditingStateChange = (event: CustomEvent<{ isEditing: boolean; itemId: number }>) => {
            setEditingCardId(event.detail.isEditing ? event.detail.itemId : null);
        };

        window.addEventListener('cardEditingStateChange', handleEditingStateChange as EventListener);
        return () => {
            window.removeEventListener('cardEditingStateChange', handleEditingStateChange as EventListener);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
            {editingCardId && (
                <div className="absolute inset-0 bg-white/30 pointer-events-none" />
            )}
            {items.map((item, index) => (
                <div
                    key={`${item.id}-${item.name}-${item.email}-${item.phone}-${item.name}`}
                    className={`
                        ${enableAnimations ? "animate-fade-in-up" : ""}
                        ${editingCardId && editingCardId !== item.id ? 'blur-sm' : ''}
                        ${editingCardId === item.id ? 'z-10 relative' : ''}
                    `}
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