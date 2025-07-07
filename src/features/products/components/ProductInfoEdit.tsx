import { useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { Category } from '@/features/admin/categories/CategoriesTypes';

interface ProductInfoEditProps {
    product: ProductDetail;
    categories: Category[];
    onSave: (product: ProductDetail) => void;
    onCancel: () => void;
}

const ProductInfoEdit = ({
    product,
    categories,
    onSave,
    onCancel,
}: ProductInfoEditProps) => {
    const [editedProduct, setEditedProduct] = useState({
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        category: product.category
    });

    const handleSave = () => {
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

        // Crear el objeto actualizado manteniendo las propiedades originales
        const updatedProduct: ProductDetail = {
            ...product,
            name: editedProduct.name,
            price: editedProduct.price,
            description: editedProduct.description,
            stock: editedProduct.stock,
            category: editedProduct.category
        };

        onSave(updatedProduct);
    };

    const handleCancel = () => {
        // Resetear el formulario
        setEditedProduct({
            name: product.name,
            price: product.price,
            description: product.description,
            stock: product.stock,
            category: product.category
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
        <div className="bg-white rounded-2xl p-7 shadow-sm space-y-6">
            {/* Header con botones de acción */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Editar Producto</h2>
                <div className="flex gap-2">
                    <Button
                        onClick={handleCancel}
                        variant='cancel'
                        className="flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant='success'
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Guardar
                    </Button>
                </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Categoría
                </label>
                <select
                    value={editedProduct.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.name}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nombre del producto */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Nombre del producto *
                </label>
                <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                    placeholder="Nombre del producto"
                />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Precio *
                    </label>
                    <input
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                        placeholder="0"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Stock disponible *
                    </label>
                    <input
                        type="number"
                        value={editedProduct.stock}
                        onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                    />
                </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    value={editedProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Descripción del producto"
                />
            </div>
        </div>
    );
};

export default ProductInfoEdit;