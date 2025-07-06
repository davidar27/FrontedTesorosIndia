import { axiosInstance } from "@/api/axiosInstance";
import { useEffect, useState, useCallback } from "react";
import { ArrowRightIcon, CreditCardIcon } from "lucide-react";
import Button from "@/components/ui/buttons/Button";

interface Item {
    service_id: number;
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
    onBeforePay?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export const MercadoPagoWallet = ({ items, total, onBeforePay, disabled, loading }: MercadoPagoWalletProps) => {
    const publicKey = (import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "APP_USR-2f137f0b-6bf1-4429-b5b3-23ae0691657e").trim();
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
        if (onBeforePay) onBeforePay();
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
        <div className="flex justify-center">
            <Button
                onClick={createPreferenceIdFromAPI}
                aria-label="Continuar Compra"
                disabled={disabled}
                loading={loading}
                messageLoading="Cargando Metodo de Pago..."
            >
                <CreditCardIcon className="w-6 h-6" />
                <span>Continuar Compra</span>
                <ArrowRightIcon className="w-6 h-6" />

            </Button>
            <div className="cho-container"></div>
        </div>
    );
};











