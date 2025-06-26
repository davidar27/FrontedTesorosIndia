import React, { useEffect, useState } from "react";
import { XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/ui/buttons/Button";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    // Obtener parámetros de URL de MercadoPago
    const statusParam = searchParams.get('status');
    const paymentIdParam = searchParams.get('payment_id');
    const preferenceIdParam = searchParams.get('preference_id');

    if (statusParam === 'rejected') {
      setErrorDetails('El pago fue rechazado por el banco o entidad financiera.');
    } else if (statusParam === 'cancelled') {
      setErrorDetails('El pago fue cancelado por el usuario.');
    } else {
      setErrorDetails('Ocurrió un problema al procesar tu pago.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Pago no completado
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          {errorDetails || 'Ocurrió un problema al procesar tu pago.'}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Verifica los datos de tu tarjeta</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm">Puedes intentar nuevamente</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/carrito")}
            variant="primary"
            className="w-full py-3"
          >
            Volver al carrito
          </Button>
          
          <Button
            onClick={() => navigate("/productos")}
            variant="secondary"
            className="w-full py-3"
          >
            Continuar comprando
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 