import { initMercadoPago } from "@mercadopago/sdk-react";
import { axiosInstance } from "@/api/axiosInstance";
import { useEffect } from "react";

interface Item {
    id: number;
    name: string;
    quantity: number;
    priceWithTax: number;
}

interface MercadoPagoWalletProps {
    items: Item[];
    total: number;
}

export const MercadoPagoWallet = ({ items, total }: MercadoPagoWalletProps) => {
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    const createPreferenceEndpoint = "/pagos/preferencia";

    useEffect(() => {
        initMercadoPago(publicKey, { locale: "es-CO" });
    }, [publicKey]);

    const createPreferenceIdFromAPI = async () => {
        const payload = {
            items: items.map(item => ({
                title: item.name,
                unit_price: item.priceWithTax,
                quantity: item.quantity,
            })),
            transaction_amount: total,
        };

        const response = await axiosInstance.post(createPreferenceEndpoint, payload, {
            headers: { "Content-Type": "application/json" },
        });

        if (response && response.data && response.data.preferenceId) {
            const checkoutUrl = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${response.data.preferenceId}`;
            window.location.href = checkoutUrl;
        }
    };

    return (
        <button
            onClick={createPreferenceIdFromAPI}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md w-full text-lg font-semibold flex items-center justify-center space-x-3"
            aria-label="Pagar con MercadoPago"
        >
            <span>Pagar con MercadoPago</span>
        </button>
    );
};











