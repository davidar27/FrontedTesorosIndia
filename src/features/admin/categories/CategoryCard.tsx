import { useState } from 'react';
import { ReusableCard } from '@/components/admin/Card';
import { Calendar, ShoppingCart } from 'lucide-react';
import { Category, UpdateCategoryData } from '@/features/admin/categories/CategoriesTypes';
import { useEntrepreneursManagement } from '@/services/admin/useEntrepreneursManagement';
import {  normalizeEntrepreneurStatus } from '../adminHelpers';
import React from 'react';
import { EditableCategoryCard } from './EditableCategoryCard';

interface CategoryCardProps {
    item: Category;
    onUpdate: (item: Category) => void;
    onDelete?: (id: number) => void;
    onChangeStatus?: (id: number, status: string) => void;
}

export const CategoryCard = React.memo(function CategoryCard({
    item,
    onUpdate,
    onDelete,
    onChangeStatus,
}: CategoryCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { updateAsync } = useEntrepreneursManagement();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSave = async (id: number, data: UpdateCategoryData | FormData) => {
        setIsEditing(false);
        setIsLoading(true);

        try {
            let result;
            if (data instanceof FormData) {
                result = await updateAsync(data);
            } else {
                result = await updateAsync({ id, ...data });
            }
            onUpdate({ ...item, ...data, image: result.image } as unknown as Category);
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating entrepreneur:', error);
            setIsLoading(false);
        }
    };

    const handleChangeStatus = () => {
        const normalizedStatus = normalizeEntrepreneurStatus(item.status);
        const newStatus = normalizedStatus === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
    };

    if (isEditing) {
        return (
            <EditableCategoryCard
                item={item}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                isLoading={isLoading}
            />
        );
    }

    const contactInfo = [
        { icon: Calendar, value: item.joinDate, label: 'Fecha de creación' },
    ];

    const stats = [
        
        {
            value: item.productsCount,
            label: 'Productos',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            icon: ShoppingCart
        },
    ];


    return (
        <ReusableCard
            item={{
                ...item,
                status: normalizeEntrepreneurStatus(item.status),
                id: item.id ?? 0,
                name: item.name,
            }}
            contactInfo={contactInfo}
            stats={stats}
            onUpdate={handleEditClick}
            onChangeStatus={handleChangeStatus}
            onDelete={() => onDelete?.(item.id ?? 0)}
            showImage={false}
            showStatus={true}
            variant="default"
            title='Categoría'
            loading={isLoading}
        >
        </ReusableCard>
    );
});
