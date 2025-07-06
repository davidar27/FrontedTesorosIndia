import { Package } from 'lucide-react';
import Button from '@/components/ui/buttons/Button';

interface ProductNotFoundProps {
    onGoBack: () => void;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ onGoBack }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Producto no encontrado
                </h2>
                <p className="text-gray-600 mb-6">
                    El producto que buscas no existe o ha sido eliminado.
                </p>
                <Button onClick={onGoBack}>
                    Volver a productos
                </Button>
            </div>
        </div>
    );
};

export default ProductNotFound;