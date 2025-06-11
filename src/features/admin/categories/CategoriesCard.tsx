import { ReusableCard } from '@/components/admin/Card';
import { Category } from '@/features/admin/categories/CategoriesTypes';


interface CategoryCardProps {
    item: Category;
    onUpdate: (item: Category) => void;
    onDelete: (id: number) => void;
}

export function CategoryCard({ item, onUpdate, onDelete }: CategoryCardProps) {
    const stats = [
        {
            value: item.productsCount,
            label: 'Productos',
            bgColor: 'bg-green-50',
            textColor: 'text-primary'
        }
    ];

    return (
        <ReusableCard
            item={item}
            stats={stats}
            onUpdate={onUpdate}
            onDelete={onDelete}
        />
    );
}
