// components/ProductImageGallery.tsx
import { getImageUrl } from '@/utils/getImageUrl';
import Picture from '@/components/ui/display/Picture';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';
import { ImageUpload } from '@/features/admin/packages/components/ImageUpload';
import { useState } from 'react';

interface ProductImageGalleryProps {
    product: ProductDetail;
    selectedImage: number;
    onImageSelect: (index: number) => void;
    isEditing: boolean;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    product,
    selectedImage,
    // onImageSelect,
    isEditing
}) => {
    const images = product.images || [product.image];
    // const hasMultipleImages = images.length > 1;
    const [draggedFile, setDraggedFile] = useState<File | null>(null);

    return (
        <div className="space-y-4">
            {/* Imagen principal */}
            <div className="bg-white rounded-2xl p-0 shadow-sm">
                {isEditing ? (
                    <ImageUpload
                            onFileSelect={setDraggedFile}
                            currentFile={draggedFile}
                            entity='product'
                            className='w-full h-100'
                        />
                ) : (
                    <Picture
                        src={getImageUrl(images[selectedImage]) || ''}
                        alt={product.name}
                        className="w-full h-115 object-cover rounded-lg"
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