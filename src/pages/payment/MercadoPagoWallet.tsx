import { axiosInstance } from "@/api/axiosInstance";
import { useEffect, useState, useCallback } from "react";
import { ArrowRightIcon, CreditCardIcon } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/ui/feedback/ConfirmDialog";
import { useNavigate } from "react-router-dom";
interface Item {
    service_id: number;
    productId?: number;
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
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const publicKey = (import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "APP_USR-2f137f0b-6bf1-4429-b5b3-23ae0691657e").trim();
    const createPreferenceEndpoint = "/pagos/preferencia";
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.MercadoPago) {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.async = true;
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
        }
    }, [preferenceId, publicKey]);

    useEffect(() => {
        if (preferenceId && window.MercadoPago) {
            openCheckout();
        }
    }, [preferenceId, openCheckout]);



    const createPreferenceIdFromAPI = async () => {
        if (onBeforePay) onBeforePay();

        if (!user || user.role !== "cliente") {
            setShowLoginModal(true);
            return;
        }

        
        const payload = {
            items: items.map(item => ({
                id: item.service_id || item.productId,
                title: item.name,
                unit_price: item.priceWithTax,
                quantity: item.quantity,
            })),
            transaction_amount: total,
            metadata: {
                user_id: user?.id,
                address: user?.address,
                items: items.map(item => ({
                    servicio_id: item.service_id || item.productId,
                    cantidad: item.quantity,
                    precio_unitario: item.priceWithTax,
                }))
            },
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


            <ConfirmDialog
                open={showLoginModal}
                title="¡Hola! Para comprar un paquete, ingresa a tu cuenta"
                description="Debes iniciar sesión para poder comprar un paquete."
                confirmText="Iniciar sesión"
                cancelText="Cerrar"
                onConfirm={() => navigate('/auth/iniciar-sesion')}
                onCancel={() => setShowLoginModal(false)}
            />
        </div>
    );
};











