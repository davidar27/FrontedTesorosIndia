import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface ProductImageGalleryProps {
    product?: ProductDetail;
    selectedImage: number;
    onImageSelect: (index: number) => void;
    isEditing?: boolean;
    onImageChange?: (file: File | null) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    product,
    selectedImage,
    onImageSelect, // Se usará cuando se implementen las miniaturas
    isEditing = false,
    onImageChange
}) => {
    const images = product?.images || [product?.image];
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Evitar error de linter - se usará cuando se implementen las miniaturas
    void onImageSelect;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Crear preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            if (onImageChange) {
                onImageChange(file);
            }
        }
    };



    const getCurrentImageSrc = () => {
        if (previewUrl) return previewUrl;
        if (selectedFile) return URL.createObjectURL(selectedFile);
        return getImageUrl(images[selectedImage]) || '';
    };

    return (
        <div className='w-full h-full bg-transparent'>
            {/* Imagen principal */}
            <div className="bg-transparent rounded-2xl p-0">
                {isEditing ? (
                    <div className="relative">
                        {/* Preview de la imagen */}
                        <div className="w-full h-50 md:h-125 lg:h-160 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                            {getCurrentImageSrc() ? (
                                <Picture
                                    src={getCurrentImageSrc()}
                                    alt={product?.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                    <Upload className="w-12 h-12 mb-2" />
                                    <span className="text-sm">Sin imagen</span>
                                </div>
                            )}
                        </div>

                        {/* Input de archivo */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            id="image-upload"
                        />

                        {/* Botón "Cambiar imagen" */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-opacity-30 transition-all duration-200">
                            <button
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition-colors"
                                type="button"
                            >
                                Cambiar imagen
                            </button>
                        </div>
                    </div>
                ) : (
                    <Picture
                        src={getImageUrl(images[selectedImage])}
                        alt={product?.name}
                        className="w-full h-125 object-cover rounded-lg"
                    />
                )}
            </div>

            {/* Miniaturas */}
            {/*  {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`
                                relative rounded-lg overflow-hidden border-2 transition-all duration-200
                                ${selectedImage === index
                                    ? 'border-green-500 ring-2 ring-green-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            <Picture
                                src={getImageUrl(image) || ''}
                                alt={`${product.name} - imagen ${index + 1}`}
                                className="w-full h-20 object-cover"
                            />
                        </button>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default ProductImageGallery;