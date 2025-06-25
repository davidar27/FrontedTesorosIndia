import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-red-700 mb-4">El pago no se pudo completar</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Ocurrió un problema al procesar tu pago. Puedes intentarlo nuevamente o elegir otro método de pago.
      </p>
      <button
        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        onClick={() => navigate("/carrito")}
      >
        Volver al carrito
      </button>
    </main>
  );
};

export default PaymentFailure; 