import { useState } from 'react';
import { ViewCard } from '@/components/admin/ReusableCard/ViewCard';
import { EditCard } from '@/components/admin/ReusableCard/EditCard';
import { Calendar, Edit, Check, X, Package } from 'lucide-react';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import { useCategoriesManagement } from '@/services/admin/useCategoriesManagement';
import { formatDate, normalizeEntrepreneurStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';

interface CategoryCardProps {
    item: Category;
    onUpdate: (item: Category) => void;
    onChangeStatus?: (id: number, status: string) => void;
}

export const CategoryCard = React.memo(function CategoryCard({
    item,
    onUpdate,
    onChangeStatus,
}: CategoryCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { updateAsync } = useCategoriesManagement();

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async (data: Partial<Category> | FormData) => {
        if (!item.id) return;
        
        setIsLoading(true);
        try {
            let result;
            if (data instanceof FormData) {
                // Si es FormData, agregar el ID
                data.append('id', String(item.id));
                result = await updateAsync(data);
            } else {
                // Si es objeto normal, agregar el ID
                result = await updateAsync({ ...data, id: item.id } as Category);
            }
            onUpdate({ ...item, ...result } as Category);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStatus = () => {
        const normalizedStatus = normalizeEntrepreneurStatus(item.status);
        const newStatus = normalizedStatus === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
    };

    const contactInfo = [
        {
            value: formatDate(item.joinDate),
            label: 'Fecha de registro',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            icon: Calendar
        }
    ];

    const stats = [
        {
            value: item.productsCount,
            label: 'Productos',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Package
        }
    ];

    const normalizedStatus = normalizeEntrepreneurStatus(item.status);
    const actions: ActionButton[] = [
        {
            icon: Edit,
            label: 'Editar',
            onClick: handleEditClick,
            variant: 'primary'
        }
    ];

    if (onChangeStatus) {
        if (normalizedStatus === 'active') {
            actions.push({
                icon: X,
                label: 'Desactivar',
                onClick: handleChangeStatus,
                variant: 'danger'
            });
        } else {
            actions.push({
                icon: Check,
                label: 'Activar',
                onClick: handleChangeStatus,
                variant: 'success'
            });
        }
    }

    if (isEditing) {
        return (
            <EditCard
                item={item}
                onSave={handleSave}
                onCancel={handleCancel}
                editFields={{
                    name: true,
                    email: true,
                    phone: true,
                    name_experience: true,
                    image: true
                }}
                contactInfo={contactInfo}
                stats={stats}
                loading={isLoading}
                title="Categoría"
            />
        );
    }

    return (
        <ViewCard
            item={item}
            contactInfo={contactInfo}
            stats={stats}
            actions={actions}
            onChangeStatus={onChangeStatus}
            loading={isLoading}
            title="Categoría"
            variant="default"
        />
    );
});
