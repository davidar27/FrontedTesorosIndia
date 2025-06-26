import React, { useEffect, useState } from "react";
import { Clock, Mail, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/ui/buttons/Button";

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // Obtener parámetros de URL de MercadoPago
    const paymentIdParam = searchParams.get('payment_id');
      // const statusParam = searchParams.get('status');
      // const preferenceIdParam = searchParams.get('preference_id');

    if (paymentIdParam) {
      setPaymentId(paymentIdParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-yellow-700 mb-4">
          Pago en proceso
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se confirme.
        </p>

        {paymentId && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>ID de Pago:</strong> {paymentId}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <span className="text-sm">Recibirás notificación por email</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">El proceso puede tomar hasta 24 horas</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            className="w-full py-3"
          >
            Volver al inicio
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

export default PaymentPending; 