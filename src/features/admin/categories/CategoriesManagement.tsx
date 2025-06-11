import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import GenericManagement from '@/components/admin/GenericManagent';
import { CreateCategoryForm } from './CreateCategoryForm';
import { useCategoriesManagement } from '@/services/admin/useCategoriesManagement';
import { CategoryCard } from './CategoryCard';
import { CategoriesConfig } from './CategoriesConfig';
import { Category, CreateCategoryData, UpdateCategoryData } from './CategoriesTypes';

export default function CategoriesManagement() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const {
        items,
        create,
        isCreating,
        changeStatus,
        updateAsync
    } = useCategoriesManagement();

    const handleCreateSubmit = (data: CreateCategoryData) => {
        toast.promise(
            new Promise((resolve, reject) => {
                create(data as unknown as Category, {
                    onSuccess: () => {
                        resolve(true);
                        setShowCreateForm(false);
                    },
                    onError: reject
                });
            }),
            {
                loading: 'Creando categoria...',
                success: 'Categoria creada exitosamente',
                error: (err) => err.message
            }
        );
    };

    const handleUpdate = useCallback(
        async (id: number, data: UpdateCategoryData) => {
            updateAsync({ id, ...data }, {
                onSuccess: () => {
                    toast.success('Categoria actualizada exitosamente');
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

    const config = useMemo(() => {
        const categories = Array.isArray(items) ? items : [];
        return CategoriesConfig({
            data: categories as unknown as Category[],
            CardComponent: (props) => (
                <CategoryCard {...props} />
            ),
            actions: {
                onCreate: () => setShowCreateForm(true),
                onUpdate: (item) => handleUpdate(item.id ?? 0, item as unknown as UpdateCategoryData),
                onDelete: () => { },
                onChangeStatus: handleChangeStatus
            }
        });
    }, [items, handleUpdate, handleChangeStatus]);

    return (
        <>
            {showCreateForm ? (
                <CreateCategoryForm
                    onSubmit={handleCreateSubmit}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                />
            ) : (
                <GenericManagement<Category> config={config} />
            )}
        </>
    );
}