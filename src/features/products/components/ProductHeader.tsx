import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';
import { ProductDetail } from '@/features/products/types/ProductDetailTypes';

interface ProductHeaderProps {
    product: ProductDetail;
    onGoBack: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product, onGoBack }) => {
    return (
        <div className="bg-white border-b sticky top-14 md:top-8 z-10 pt-8">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="success"
                        onClick={onGoBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Productos</span>
                        <span>/</span>
                        <span>{product.category || 'Sin categoría'}</span>
                        <span>/</span>
                        <span className="text-gray-800">{product.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductHeader;