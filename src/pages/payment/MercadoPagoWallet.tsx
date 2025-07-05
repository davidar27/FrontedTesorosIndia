import { axiosInstance } from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
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
    const publicKey = (import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "APP_USR-2f137f0b-6bf1-4429-b5b3-23ae0691657e").trim();
    const createPreferenceEndpoint = "/pagos/preferencia";
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();


    // Validate that the public key is available and properly formatted
    useEffect(() => {
        console.log("Public key value:", `"${publicKey}"`);
        console.log("Public key length:", publicKey.length);
        console.log("Contains spaces:", publicKey.includes(' '));
        console.log("Starts with APP_USR-:", publicKey.startsWith('APP_USR-'));

        if (!publicKey) {
            setError("Error de configuración: Clave pública de MercadoPago no encontrada");
            console.error("VITE_MERCADOPAGO_PUBLIC_KEY no está definida en las variables de entorno");
            return;
        }

        // Validate public key format (should start with APP_USR- and not contain whitespace)
        if (!publicKey.startsWith('APP_USR-') || publicKey.includes(' ')) {
            setError("Error de configuración: Clave pública de MercadoPago inválida");
            console.error("La clave pública de MercadoPago debe comenzar con 'APP_USR-' y no contener espacios");
            return;
        }
    }, [publicKey]);

    useEffect(() => {
        // Add global error handler to suppress postMessage errors from third-party tools
        const handleGlobalError = (event: ErrorEvent) => {
            if (event.message && event.message.includes('postMessage') && event.message.includes('hotjar')) {
                event.preventDefault();
                console.warn('Suppressed Hotjar postMessage error:', event.message);
                return false;
            }
        };

        window.addEventListener('error', handleGlobalError);

        if (!window.MercadoPago) {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.async = true;
            script.onload = () => {
                console.log("MercadoPago SDK cargado");
            };
            script.onerror = () => {
                setError("Error al cargar el SDK de MercadoPago");
                console.error("Error al cargar el SDK de MercadoPago");
            };
            document.head.appendChild(script);

            return () => {
                const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
                if (existingScript) {
                    document.head.removeChild(existingScript);
                }
                window.removeEventListener('error', handleGlobalError);
            };
        }

        return () => {
            window.removeEventListener('error', handleGlobalError);
        };
    }, []);

    const openCheckout = useCallback(() => {
        if (!publicKey) {
            setError("Error de configuración: Clave pública de MercadoPago no encontrada");
            return;
        }

        // Additional validation before using the public key
        if (!publicKey.startsWith('APP_USR-') || publicKey.includes(' ')) {
            setError("Error de configuración: Clave pública de MercadoPago inválida");
            console.error("Public key validation failed:", publicKey);
            return;
        }

        if (window.MercadoPago) {
            try {
                console.log("Initializing MercadoPago with public key:", publicKey);
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
            } catch (err) {
                setError("Error al inicializar MercadoPago");
                console.error("Error al inicializar MercadoPago:", err);
            }
        } else {
            setError("SDK de MercadoPago no está cargado");
            console.log("MercadoPago SDK no está cargado");
        }
    }, [preferenceId, publicKey]);

    useEffect(() => {
        if (preferenceId && window.MercadoPago && publicKey) {
            openCheckout();
        }
    }, [preferenceId, openCheckout, publicKey]);

    const createPreferenceIdFromAPI = async () => {
        if (!publicKey) {
            setError("Error de configuración: Clave pública de MercadoPago no encontrada");
            return;
        }

        try {
            const payload = {
                items: items.map(item => ({
                    id: item.id,
                    title: item.name,
                    unit_price: item.priceWithTax,
                    quantity: item.quantity,
                })),
                transaction_amount: total,
                usuario_id: user?.id,
                payer: {
                    first_name: user?.name,
                    email: user?.email,
                    address: user?.address
                }
            };


            const response = await axiosInstance.post(createPreferenceEndpoint, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (response && response.data && response.data.preferenceId) {
                setPreferenceId(response.data.preferenceId);
                setError(null); // Clear any previous errors
            } else {
                setError("Error al crear la preferencia de pago");
            }
        } catch (err) {
            setError("Error al procesar el pago");
            console.error("Error al crear preferencia:", err);
        }
    };

    if (error) {
        return (
            <div className="text-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                    <p className="text-red-600 text-xs mt-2">
                        Por favor, contacta al administrador del sitio.
                    </p>
                </div>
            </div>
        );
    }

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











