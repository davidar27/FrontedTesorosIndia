/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ViewCard } from '@/components/admin/ReusableCard/ViewCard';
import { EditCard } from '@/components/admin/ReusableCard/EditCard';
import { Edit, Check, X, Tags } from 'lucide-react';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import { useCategoriesManagement } from '@/services/admin/useCategoriesManagement';
import { normalizeStatus } from '../adminHelpers';
import React from 'react';
import type { ActionButton } from '@/components/admin/ReusableCard/types';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';

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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'activate' | 'disable' | null>(null);
    const { updateAsync } = useCategoriesManagement();


    const normalizedStatus = normalizeStatus(item.status);


    React.useEffect(() => {
        const event = new CustomEvent('cardEditingStateChange', {
            detail: { isEditing, itemId: item.id }
        });
        window.dispatchEvent(event);
    }, [isEditing, item.id]);

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
                data.append('id', String(item.id));
                result = await updateAsync(data);
            } else {
                result = await updateAsync({ ...data, id: item.id });
            }
            
            if (result && typeof result === 'object' && 'updatedFields' in result) {
                const updatedFields = result.updatedFields as Record<string, any>;
                onUpdate({ ...item, ...updatedFields });
            } else if (result && typeof result === 'object') {
                const responseData = result as Record<string, any>;
                onUpdate({ ...item, ...responseData });
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleChangeStatus = () => {
        
        const action = normalizedStatus === 'inactive' ? 'activate' : 'disable';
        setConfirmAction(action);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!confirmAction) return;

        const newStatus = normalizedStatus === 'inactive' ? 'active' : 'inactive';
        onChangeStatus?.(item.id ?? 0, newStatus);
        setConfirmOpen(false);
        setConfirmAction(null);
    };

 

    const stats = [
        {
            value: item.productsCount,
            label: 'Productos',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            icon: Tags
        }
    ];

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
                item={item as unknown as Category & { type: string }}
                onSave={handleSave}
                onCancel={handleCancel}
                editFields={{
                    name: true,
                    email: true,
                    phone: true,
                    name_experience: true,
                    image: true
                }}
                showImage={false}
                stats={stats}
                loading={isLoading}
                title="Categoría"
            />
        );
    }

    return (
        <>
            <ViewCard
                item={item as unknown as Category & { type: string }}
                showImage={false}
                showStatus={true}
                stats={stats}
                actions={actions}
                onChangeStatus={onChangeStatus}
                loading={isLoading}
                title="Categoría"
                variant="default"
            />
            <ConfirmDialog
                open={confirmOpen}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
                title={
                    confirmAction === 'activate'
                        ? '¿Activar Categoría?'
                        : '¿Desactivar Categoría?'
                }
                description={
                    confirmAction === 'activate'
                        ? `¿Deseas activar ${item.name}?`
                        : `¿Deseas desactivar ${item.name}?`
                }
                confirmText={
                    confirmAction === 'activate'
                        ? 'Activar'
                        : 'Desactivar'
                }
            />
        </>
    );
});
