import { useState, useEffect } from 'react';
import ProductInfoView from '@/features/products/components/ProductInfoView';
import ProductInfoEdit from '@/features/products/components/ProductInfoEdit';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { Category } from '@/features/admin/categories/CategoriesTypes';

interface ProductInfoProps {
    product: ProductDetail;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    isAddingToCart: boolean;
    canManageProducts: boolean;
    onProductUpdate: (product: ProductDetail) => void;
    categories: Category[];
    onEditModeChange: (editing: boolean) => void;
    onDeleteProduct?: () => void;
}

const ProductInfo = ({
    product,
    quantity,
    onQuantityChange,
    onAddToCart,
    isAddingToCart,
    canManageProducts,
    onProductUpdate,
    categories,
    onEditModeChange,
    onDeleteProduct
}: ProductInfoProps) => {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        onEditModeChange(isEditing);
    }, [isEditing, onEditModeChange]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = (updatedProduct: ProductDetail) => {
        onProductUpdate(updatedProduct);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <ProductInfoEdit
                product={product}
                categories={categories}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <ProductInfoView
            product={product}
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            onAddToCart={onAddToCart}
            isAddingToCart={isAddingToCart}
            canManageProducts={canManageProducts}
            onEditClick={handleEditClick}
            onDeleteProduct={onDeleteProduct}
        />
    );
};

export default ProductInfo;