import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { ImageUpload } from '@/features/admin/packages/components/ImageUpload';
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

    // Evitar error de linter - se usará cuando se implementen las miniaturas
    void onImageSelect;

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (onImageChange) {
            onImageChange(file);
        }
    };

    return (
        <div className='w-full h-full bg-transparent'>
            {/* Imagen principal */}
            <div className="bg-transparent rounded-2xl p-0">
                {isEditing ? (
                    <ImageUpload
                        onFileSelect={handleFileSelect}
                        currentFile={selectedFile || product?.image}
                        entity='product'
                        className='w-full h-115'
                    />
                ) : (
                    <Picture
                        src={getImageUrl(images[selectedImage])}
                        alt={product?.name}
                        className="w-full h-full object-cover rounded-lg"
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