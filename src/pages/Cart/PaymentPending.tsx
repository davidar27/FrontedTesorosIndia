import React from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <Clock className="w-20 h-20 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Pago pendiente de confirmación</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se confirme.
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

export default PaymentPending; 