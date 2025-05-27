import GenericManagement from '@/components/admin/GenericManagent';
import { CategoryCard } from '@/features/admin/categories/CategoriesCard';
import { createCategoriesConfig } from '@/features/admin/categories/createCategoriesConfig';
import { Category } from '@/features/admin/categories/CategoriesTypes';




const categories: Category[] = [
    {
        id: 1,
        name: "Comida",
        productsCount: 12,
        status: "active",
    },
    // ... más categorías
];

export default function CategoriesManagement() {
    const handleEdit = (category: Category) => {
        console.log('Editing category:', category);
    };

    const handleDelete = (categoryId: number) => {
        console.log('Deleting category:', categoryId);
    };


    const handleCreate = () => {
        console.log('Creating new category');
    };

    const config = createCategoriesConfig(
        categories,
        CategoryCard,
        { onEdit: handleEdit, onDelete: handleDelete, onCreate: handleCreate }
    );

    return   <GenericManagement config={config} />;
}