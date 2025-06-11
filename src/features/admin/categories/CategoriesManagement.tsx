import { useEffect, useState } from 'react';
import GenericManagement from '@/components/admin/GenericManagent';
import { createCategoriesConfig } from '@/features/admin/categories/createCategoriesConfig';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import { categoriesApi } from '@/services/admin/categories';
import { toast } from 'sonner';

export default function CategoriesManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoriesApi.getAllCategories();
            setCategories(data);
            setError(null);
        } catch {
            const errorMessage = 'Error al cargar las categorías';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = async (category: Category) => {
        try {
            await categoriesApi.updateCategory(category.id, category);
            await fetchCategories();
            toast.success('Categoría actualizada correctamente');
        } catch {
            toast.error('Error al actualizar la categoría');
        }
    };

    const handleDisable = async (categoryId: number) => {
        try {
            await categoriesApi.disableCategory(categoryId);
            await fetchCategories();
            toast.success('Categoría inhabilitada correctamente');
        } catch {
            toast.error('Error al Desactivar la categoría');
        }
    };

    const handleCreate = async () => {
        // Note: This would typically open a modal or navigate to a create form
        toast.info('Funcionalidad de crear categoría pendiente');
    };

    const config = createCategoriesConfig({
        data: categories,
        isLoading,
        error,
        actions: {
            onUpdate: handleEdit,
            onDelete: handleDisable,
            onCreate: handleCreate,
            onRetry: fetchCategories
        }
    });

    return <GenericManagement config={config} />;
}