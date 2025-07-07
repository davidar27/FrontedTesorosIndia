import { useState } from 'react';
import { Save, X, AlertCircle, Package, Tag, DollarSign, Warehouse } from 'lucide-react';
import { ImageUpload } from '@/features/admin/packages/components/ImageUpload';
import Button from '@/components/ui/buttons/Button';
import { formatPrice } from '@/utils/formatPrice';
import { Category } from '@/features/admin/categories/CategoriesTypes';



export interface CreateProductData {
    name: string;
    price: number;
    description: string;
    category: string;
    stock: number;
    image?: File | null;
}

interface CreateProductFormProps {
    categories: Category[];
    onSave: (product: CreateProductData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}




const CreateProductForm = ({
    categories,
    onSave,
    onCancel,
    isLoading = false,
}: CreateProductFormProps) => {
    const [formData, setFormData] = useState<CreateProductData>({
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
        image: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [draggedFile, setDraggedFile] = useState<File | null>(null);
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre del producto es obligatorio';
        }

        if (formData.price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
        }

        if (!formData.category) {
            newErrors.category = 'Debe seleccionar una categoría';
        }

        if (formData.stock < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        onSave(formData);
    };

    const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
                    {/* Header con diseño inspirado en la India */}
                    <div className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 p-8 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Crear Nuevo Tesoro</h1>
                                <p className="text-orange-100 text-lg">Comparte tus productos únicos con el mundo</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    variant='success'
                                    className='flex items-center gap-2'
                                >
                                    <Save className="w-5 h-5" />
                                    {isLoading ? 'Guardando...' : 'Guardar Producto'}
                                </Button>
                                <Button
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    variant='cancel'
                                    className='flex items-center gap-2'
                                >
                                    <X className="w-5 h-5" />
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del formulario */}
                    <div className="p-8 space-y-8">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Columna izquierda */}
                            <div className="space-y-6">
                                {/* Nombre del producto */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Package className="w-5 h-5 text-primary" />
                                        Nombre del producto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.name ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary'
                                            }`}
                                        placeholder="Ej: Café Premium de los Andes Colombianos"
                                    />
                                    {errors.name && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm">{errors.name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Categoría */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Tag className="w-5 h-5 text-primary" />
                                        Categoría *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${errors.category ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary'
                                            }`}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm">{errors.category}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Precio y Stock */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                            Precio *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.price || ''}
                                            onChange={(e) => {
                                                const numbers = e.target.value.replace(/[^\d]/g, '');
                                                handleInputChange('price', Number(numbers));
                                            }}
                                            onBlur={(e) => {
                                                if (formData.price > 0) {
                                                    e.target.value = formatPrice(formData.price);
                                                }
                                            }}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.price ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary'
                                                }`}
                                            placeholder="Ej: 25000"
                                        />
                                        {errors.price && (
                                            <div className="flex items-center gap-2 text-red-600">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm">{errors.price}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                            <Warehouse className="w-5 h-5 text-primary" />
                                            Stock
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.stock || ''}
                                            onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.stock ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary'
                                                }`}
                                            placeholder="Ej: 50"
                                            min="0"
                                        />
                                        {errors.stock && (
                                            <div className="flex items-center gap-2 text-red-600">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm">{errors.stock}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Columna derecha - Imagen */}
                            <ImageUpload
                                onFileSelect={setDraggedFile}
                                currentFile={draggedFile}
                                entity='product'
                                className='w-full h-72'
                            />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <Package className="w-5 h-5 text-primary" />
                                Descripción del producto *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={6}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${errors.description ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-primary'
                                    }`}
                                placeholder="Cuenta la historia de tu producto: su origen, características únicas, beneficios, proceso de elaboración, y qué lo hace especial..."
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{errors.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProductForm;