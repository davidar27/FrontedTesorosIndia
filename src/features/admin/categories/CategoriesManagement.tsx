import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { useCategoriesManagement } from '@/services/admin/useCategoriesManagement';
import { CategoryCard } from '@/features/admin/categories/CategoryCard';
import { CategoriesConfig } from '@/features/admin/categories/CategoriesConfig';
import { Category, UpdateCategoryData, CategoryStatus } from '@/features/admin/categories/CategoriesTypes';
import { CreateCard } from '@/components/admin/ReusableCard/CreateCard';

type CategoryWithForm = Category | {
    id: -1;
    isForm: true;
    name: string;
    status: CategoryStatus;
    productsCount: number;
    joinDate: string;
};

export default function CategoriesManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const {
        items,
        changeStatus,
        updateAsync,
        createAsync
    } = useCategoriesManagement();

    const handleCreateSubmit = useCallback(async (data: Partial<Category>) => {
        setIsCreating(true);
        try {
            await createAsync(data, {
                onSuccess: () => {
                    toast.success('Categoría creada exitosamente');
                    setShowCreateForm(false);
                },
                onError: (err) => {
                    toast.error(err.message);
                }
            });
        } finally {
            setIsCreating(false);
        }
    }, [createAsync]);

    const handleUpdate = useCallback(
        async (id: number, data: UpdateCategoryData) => {
            updateAsync({ id, ...data }, {
                onSuccess: () => {
                    toast.success('Categoría actualizada exitosamente');
                },
                onError: (err) => {
                    toast.error(err.message);
                }
            });
        },
        [updateAsync]
    );

    const handleChangeStatus = useCallback(
        (id: number, status: string) => {
            changeStatus({
                id,
                status,
                entityType: 'category'
            }, {
                onSuccess: () => {
                    toast.success('Estado actualizado exitosamente');
                },
                onError: (err) => {
                    toast.error(err.message);
                }
            });
        }, [changeStatus]);

    const itemsWithForm = useMemo(() => {
        const categories = Array.isArray(items) ? items : [];
        if (showCreateForm) {
            return [{
                id: -1,
                isForm: true,
                name: '',
                status: 'active' as CategoryStatus,
                productsCount: 0,
                joinDate: new Date().toISOString()
            }, ...categories];
        }
        return categories;
    }, [items, showCreateForm]);

    const config = useMemo(() => {
        return CategoriesConfig({
            data: itemsWithForm,
            CardComponent: (props) => {
                if ('isForm' in props.item) {
                    return (
                        <div className="animate-fade-in-up">
                            <CreateCard
                                item={props.item}
                                onCreate={handleCreateSubmit}
                                onCancel={() => setShowCreateForm(false)}
                                loading={isCreating}
                                editFields={{
                                    name: true
                                }}
                                entityName="Categoría"
                            />
                        </div>
                    );
                }
                return <CategoryCard {...props} />;
            },
            actions: {
                onCreate: () => setShowCreateForm(true),
                onUpdate: (item) => {
                    if (!('isForm' in item)) {
                        handleUpdate(item.id ?? 0, item as unknown as UpdateCategoryData);
                    }
                },
                onChangeStatus: (id, status) => {
                    if (id !== -1) {
                        handleChangeStatus(id, status);
                    }
                }
            }
        });
    }, [itemsWithForm, isCreating, handleUpdate, handleChangeStatus, handleCreateSubmit]);

    return (
        <GenericManagement<CategoryWithForm> config={config} />
    );
}