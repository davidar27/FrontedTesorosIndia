import { axiosInstance } from "@/api/axiosInstance";
import { useEffect, useState, useCallback } from "react";

interface Item {
    id: number;
    name: string;
    quantity: number;
    priceWithTax: number;
}
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        MercadoPago?: new (publicKey: string, options?: { locale?: string }) => any;
    }
}

interface MercadoPagoWalletProps {
    items: Item[];
    total: number;
}

export const MercadoPagoWallet = ({ items, total }: MercadoPagoWalletProps) => {
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    const createPreferenceEndpoint = "/pagos/preferencia";
    const [preferenceId, setPreferenceId] = useState<string | null>(null);


    useEffect(() => {
        if (!window.MercadoPago) {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.async = true;
            script.onload = () => {
                console.log("MercadoPago SDK cargado");
            };
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, []);

    const openCheckout = useCallback(() => {
        if (window.MercadoPago) {
            const mp = new window.MercadoPago(publicKey, {
                locale: "es-CO"
            });
            mp.checkout({
                preference: { id: preferenceId },
                autoOpen: true,
                iFrame: true,
                render: {
                    container: ".cho-container",
                    label: "Pagar",

                },

            });
        } else {
            console.log("MercadoPago SDK no está cargado");
        }
    }, [preferenceId, publicKey]);

    useEffect(() => {
        if (preferenceId && window.MercadoPago) {
            openCheckout();
        }
    }, [preferenceId, openCheckout]);



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
            setPreferenceId(response.data.preferenceId);
        }
    };

    return (
        <div>
            <button
                onClick={createPreferenceIdFromAPI}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md w-full text-lg font-semibold flex items-center justify-center space-x-3"
                aria-label="Continuar Compra"
            >
                <span>Continuar Compra</span>
            </button>
            <div className="cho-container"></div>
        </div>
    );
};











