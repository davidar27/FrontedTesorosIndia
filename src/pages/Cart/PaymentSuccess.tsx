import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { handleClearCartAfterPayment } = useCart();

  useEffect(() => {
    handleClearCartAfterPayment();
    // Solo limpiar una vez al montar
    // eslint-disable-next-line
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
      <h1 className="text-3xl font-bold text-emerald-700 mb-4">¡Pago realizado con éxito!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Gracias por tu compra. Pronto recibirás la confirmación y detalles de tu pedido en tu correo electrónico.
      </p>
      <button
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </main>
  );
};

export default PaymentSuccess; 