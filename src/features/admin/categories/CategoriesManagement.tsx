import GenericManagement from '@/components/admin/GenericManagent';
import { CategoryCard } from '@/features/admin/categories/CategoriesCard';
import { createCategoriesConfig } from '@/features/admin/categories/createCategoriesConfig';
import { Category } from './CategoriesTypes';




const categories: Category[] = [
    {
        id: 1,
        name: "Café Premium",
        description: "Cafés de alta calidad con procesos especiales",
        productsCount: 12,
        color: "#8B4513",
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

    const handleView = (category: Category) => {
        console.log('Viewing category:', category);
    };

    const handleCreate = () => {
        console.log('Creating new category');
    };

    const config = createCategoriesConfig(
        categories,
        CategoryCard,
        { onEdit: handleEdit, onDelete: handleDelete, onView: handleView, onCreate: handleCreate }
    );

    return   <GenericManagement config={config} />;
}