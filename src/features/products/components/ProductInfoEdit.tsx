import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import { updateProduct } from '@/services/product/productServie';
import { useAuth } from '@/context/AuthContext';

interface ProductInfoEditProps {
    product: ProductDetail;
    categories: Category[];
    onSave: (product: ProductDetail) => void;
    onCancel: () => void;
    selectedImageFile?: File | null;
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
    const [editedProduct, setEditedProduct] = useState({
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        category_id: categories.find(cat => cat.name === product.category)?.id || 0
    });

    const handleSave = async () => {
        // Validaciones
        if (!editedProduct.name.trim()) {
            alert('El nombre del producto es obligatorio');
            return;
        }
        if (editedProduct.price <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }
        if (editedProduct.stock < 0) {
            alert('El stock no puede ser negativo');
            return;
        }
        if (editedProduct.category_id === 0) {
            alert('Debe seleccionar una categoría');
            return;
        }

        if (!user) {
            alert('Usuario no autenticado');
            return;
        }

        setIsLoading(true);
        try {
            const productData = {
                name: editedProduct.name,
                description: editedProduct.description,
                price: editedProduct.price,
                stock: editedProduct.stock,
                userId: Number(user.id),
                category_id: editedProduct.category_id,
                image: selectedImageFile || undefined
            };

            await updateProduct(product.product_id, product.experience_id || 0, productData);

            const updatedProduct: ProductDetail = {
                ...product,
                name: editedProduct.name,
                price: editedProduct.price,
                description: editedProduct.description,
                stock: editedProduct.stock,
                category: categories.find(cat => cat.id === editedProduct.category_id)?.name
            };

            onSave(updatedProduct);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el producto';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
            category_id: categories.find(cat => cat.name === product.category)?.id || 0
        });
        onCancel();
    };

    const handleInputChange = (field: string, value: string | number) => {
        setEditedProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="bg-white rounded-2xl p-7 shadow-sm space-y-4">
            {/* Etiquetas y botones de acción */}
            <div className="flex items-center flex-col md:flex-row justify-between">
                <div className="flex items-center gap-2">
                    <select
                        value={editedProduct.category_id}
                        onChange={(e) => handleInputChange('category_id', Number(e.target.value))}
                        className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value={0}>Selecciona categoría</option>
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 pl-1"> Nombre del producto *</label>
                <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-3xl font-bold text-gray-800 bg-gray-100 border-none outline-none w-full focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                    placeholder="Nombre del producto"
                />
            </div>
            {/* Precio */}
            <div className="flex items-center gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 pl-1">
                        Precio *
                    </label>
                    <input
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                        placeholder="0"
                        step="1000"
                    />
                </div>
                {/* Stock */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 pl-1">
                        Stock disponible:
                    </label>
                    <input
                        type="number"
                        value={editedProduct.stock}
                        onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                        placeholder="0"
                        min="1"
                    />
                </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 pl-1">
                    Descripción del producto *
                </label>
                <textarea
                    value={editedProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="text-gray-600 leading-relaxed bg-gray-100 border-none outline-none w-full resize-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
                    placeholder="Descripción del producto"
                />
            </div>




        </div>
    );
};

export default ProductInfoEdit;