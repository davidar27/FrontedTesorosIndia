import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/buttons/Button";


export const EmptyCartState: React.FC<{ onContinueShopping: () => void }> = ({ onContinueShopping }) => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center">
        <div className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Carrito vacío</h1>
            <p className="text-gray-600 mb-6">No hay productos en tu carrito para procesar el pago.</p>
            <Button onClick={onContinueShopping} variant="primary">
                Continuar comprando
            </Button>
        </div>
    </div>
);
