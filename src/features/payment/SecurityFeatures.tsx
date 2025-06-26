import { Shield, CheckCircle, CreditCard } from "lucide-react";


export const SecurityFeatures: React.FC = () => (
    <div className="pt-6 border-t border-gray-200">
        <div className="space-y-3">
            <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Pago 100% seguro</span>
            </div>
            <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Encriptación SSL</span>
            </div>
            <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Múltiples métodos de pago</span>
            </div>
        </div>
    </div>
);