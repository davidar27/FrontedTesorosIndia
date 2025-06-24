import React from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

interface Props {
  preferenceId: string;
}

const PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY; // Reemplaza por tu public key de Mercado Pago

export const MercadoPagoCheckoutBrick: React.FC<Props> = ({ preferenceId }) => {
  React.useEffect(() => {
    initMercadoPago(PUBLIC_KEY, { locale: "es-CO" });
  }, []);

  return (
    <div>
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
}; 