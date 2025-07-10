import { useState } from 'react';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import { updateProduct } from '@/services/product/productServie';
import { useAuth } from '@/context/AuthContext';
import SuccessModal from '@/features/products/components/SuccessModal';
import Header from '@/features/products/components/editProduct/Header';
import NameField from '@/features/products/components/editProduct/NameField';
import CategoryField from '@/features/products/components/editProduct/CategoryField';
import PriceField from '@/features/products/components/editProduct/PriceField';
import StockField from '@/features/products/components/StockField';
import DescriptionField from '@/features/products/components/editProduct/DescriptionField';
import ChangesIndicator from '@/features/products/components/editProduct/ChangesIndicator';

export interface ProductInfoEditProps {
    product: ProductDetail;
    categories: Category[];
    onSave: (product: ProductDetail) => void;
    onCancel: () => void;
    selectedImageFile?: File | null;
}

export interface EditedProduct {
    name: string;
    price: number;
    description: string;
    stock: number;
    category_id: number;
}

export interface ValidationErrors {
    name?: string;
    price?: string;
    stock?: string;
    category_id?: string;
    description?: string;
}

const ProductInfoEdit = ({
    product,
    categories,
    onSave,
    onCancel,
    selectedImageFile
}: ProductInfoEditProps) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [editedProduct, setEditedProduct] = useState<EditedProduct>({
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        category_id: categories.find(cat => cat.name === product.category)?.id || 0
    });

    // Validation logic
    const validateField = (field: keyof EditedProduct, value: string | number): string | undefined => {
        switch (field) {
            case 'name':
                return !String(value)?.trim() ? 'El nombre del producto es obligatorio' : undefined;
            case 'price':
                return Number(value) <= 0 ? 'El precio debe ser mayor a 0' : undefined;
            case 'stock':
                return Number(value) < 0 ? 'El stock no puede ser negativo' : undefined;
            case 'category_id':
                return Number(value) === 0 ? 'Debe seleccionar una categoría' : undefined;
            case 'description':
                return !String(value)?.trim() ? 'La descripción es obligatoria' : undefined;
            default:
                return undefined;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        Object.keys(editedProduct).forEach((key) => {
            const field = key as keyof EditedProduct;
            const error = validateField(field, editedProduct[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Change detection
    const getOriginalCategoryId = (): number => {
        return categories.find(cat => cat.name === product.category)?.id || 0;
    };

    const hasChanges = (): boolean => {
        return (
            editedProduct.name !== product.name ||
            editedProduct.price !== product.price ||
            editedProduct.description !== product.description ||
            editedProduct.stock !== product.stock ||
            editedProduct.category_id !== getOriginalCategoryId() ||
            !!selectedImageFile
        );
    };

    const getModifiedFields = (): Record<string, string | number | File> => {
        const modifiedFields: Record<string, string | number | File> = {};
        const originalCategoryId = getOriginalCategoryId();

        if (editedProduct.name !== product.name) {
            modifiedFields.name = editedProduct.name;
        }
        if (editedProduct.price !== product.price) {
            modifiedFields.price = editedProduct.price;
        }
        if (editedProduct.description !== product.description) {
            modifiedFields.description = editedProduct.description;
        }
        if (editedProduct.stock !== product.stock) {
            modifiedFields.stock = editedProduct.stock;
        }
        if (editedProduct.category_id !== originalCategoryId) {
            modifiedFields.category_id = editedProduct.category_id;
        }
        if (selectedImageFile) {
            modifiedFields.image = selectedImageFile;
        }

        return modifiedFields;
    };

    // API operations
    const saveProduct = async (): Promise<void> => {
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        const modifiedFields = getModifiedFields();

        if (Object.keys(modifiedFields).length === 0) {
            throw new Error('No hay cambios para guardar');
        }

        const productData = {
            ...modifiedFields,
            userId: Number(user.id)
        };

        await updateProduct(product.product_id, product.experience_id || 0, productData);
    };

    const createUpdatedProduct = (): ProductDetail => {
        return {
            ...product,
            name: editedProduct.name,
            price: editedProduct.price,
            description: editedProduct.description,
            stock: editedProduct.stock,
            category: categories.find(cat => cat.id === editedProduct.category_id)?.name || product.category
        };
    };

    // Event handlers
    const handleSave = async (): Promise<void> => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await saveProduct();
            const updatedProduct = createUpdatedProduct();

            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                onSave(updatedProduct);
            }, 2000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el producto';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = (): void => {
        setEditedProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
            category_id: getOriginalCategoryId()
        });
        setIsEditingPrice(false);
        setErrors({});
        onCancel();
    };

    const handleInputChange = (field: keyof EditedProduct, value: string | number): void => {
        setEditedProduct(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handlePriceClick = (): void => {
        setIsEditingPrice(true);
    };

    const handlePriceBlur = (): void => {
        setIsEditingPrice(false);
    };

    const handlePriceKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            setIsEditingPrice(false);
        }
        if (e.key === 'Escape') {
            setEditedProduct(prev => ({ ...prev, price: product.price }));
            setIsEditingPrice(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl  p-8 h-full">
                <Header handleCancel={handleCancel} handleSave={handleSave} isLoading={isLoading} />

                <div className="space-y-6">
                    <NameField errors={errors} editedProduct={editedProduct} handleInputChange={handleInputChange} />
                    <CategoryField errors={errors} editedProduct={editedProduct} handleInputChange={handleInputChange} categories={categories} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PriceField errors={errors} editedProduct={editedProduct} handleInputChange={handleInputChange} isEditingPrice={isEditingPrice} handlePriceClick={handlePriceClick} handlePriceBlur={handlePriceBlur} handlePriceKeyDown={handlePriceKeyDown} />
                        <StockField errors={errors} editedProduct={editedProduct} handleInputChange={handleInputChange} />
                    </div>

                    <DescriptionField errors={errors} editedProduct={editedProduct} handleInputChange={handleInputChange} />
                    <ChangesIndicator hasChanges={hasChanges} />
                </div>
            </div>

            <SuccessModal showSuccessModal={showSuccessModal} />
        </>
    );
};

export default ProductInfoEdit;