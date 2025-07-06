import React, { useEffect, useState } from "react";
import { CheckCircle, Mail, Clock } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/buttons/Button";
import { axiosInstance } from "@/api/axiosInstance";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleClearCart } = useCart();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const location = useLocation();

  // Recupera los datos de la reserva (pueden venir en location.state o localStorage)
  const reservationData = location.state?.reservationData || JSON.parse(localStorage.getItem("reservationData") || "null");

  useEffect(() => {
    // Guarda los parámetros en localStorage si están en la URL
    const paymentIdParam = searchParams.get('payment_id') || localStorage.getItem('paymentId');
    const statusParam = searchParams.get('status') || localStorage.getItem('statusPayment');
    // const preferenceIdParam = searchParams.get('preference_id');

    console.log("paymentIdParam", paymentIdParam);
    console.log("statusParam", statusParam);
    console.log("reservationData", reservationData);


    if (paymentIdParam) {
      setPaymentId(paymentIdParam);
    }

    if (statusParam === 'approved') {
      if (reservationData) {
        axiosInstance.post('/reserva/reservar', {
          ...reservationData,
          paymentId: paymentIdParam,
        }).then(() => {
          localStorage.removeItem("reservationData");
        }).catch((err) => {
          console.error("Error creando la reserva:", err);
        });
      }
      handleClearCart();

      localStorage.removeItem("paymentId");
      localStorage.removeItem("statusPayment");

    }

  }, [searchParams, handleClearCart, reservationData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          ¡Pago realizado con éxito!
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Gracias por tu compra. Tu pago ha sido procesado correctamente.
        </p>

        {paymentId && (
          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-emerald-800">
              <strong>ID de Pago:</strong> {paymentId}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5" />
            <span className="text-sm">Recibirás confirmación por email</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Procesando tu pedido</span>
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

export default PaymentSuccess; 