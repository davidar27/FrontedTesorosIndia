import React, { useState, useCallback, useEffect } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { axiosInstance } from "@/api/axiosInstance";

// Extend Window interface for MercadoPago controller
declare global {
    interface Window {
        paymentBrickController?: {
            unmount: () => void;
        };
    }
}

interface PaymentBrickProps {
    preferenceId: string;
    amount?: number;
    payer?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    onSuccess?: (paymentData: unknown) => void;
    onError?: (error: unknown) => void;
    onPending?: (paymentData: unknown) => void;
    onRejected?: (paymentData: unknown) => void;
    className?: string;
}

const PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export const PaymentBrick: React.FC<PaymentBrickProps> = ({
    preferenceId,
    amount = 10000,
    payer,
    onSuccess,
    onError,
    onPending,
    onRejected,
    className = ""
}) => {
    const [, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'pending' | 'rejected'>('idle');

    React.useEffect(() => {
        if (PUBLIC_KEY) {
            initMercadoPago(PUBLIC_KEY, { locale: "es-CO" });
        } else {
            console.error("MercadoPago public key not found");
        }
    }, []);

    // Cleanup function to unmount the Brick when component unmounts
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.paymentBrickController) {
                window.paymentBrickController.unmount();
            }
        };
    }, []);

    const initialization = {
        amount,
        preferenceId,
        payer: payer || {
            firstName: "",
            lastName: "",
            email: "",
        },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customization: any = {
        paymentMethods: {
            mercadoPago: "all",
            creditCard: "all",
            debitCard: "name",
            ticket: "all",
            bankTransfer: "all",
            maxInstallments: 2
        }
    }


    const handleSubmit = useCallback(async ({ formData }: { formData: unknown }) => {
        setIsLoading(true);
        setPaymentStatus('processing');

        try {
            const response = await axiosInstance.post("/pagos/process-payment", formData);
            const result = response.data;

            if (result.status === "approved") {
                setPaymentStatus('success');
                onSuccess?.(result);
            } else if (result.status === "pending") {
                setPaymentStatus('pending');
                onPending?.(result);
            } else if (result.status === "rejected") {
                setPaymentStatus('rejected');
                onRejected?.(result);
            }
        } catch (error) {
            console.error("Payment error:", error);
            setPaymentStatus('error');
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
    }, [onSuccess, onError, onPending, onRejected]);

    const handleError = useCallback((error: unknown) => {
        console.error("Payment Brick error:", error);
        setPaymentStatus('error');
        onError?.(error);
    }, [onError]);

    const handleReady = useCallback(() => {
        console.log("Payment Brick ready");
        setPaymentStatus('idle');
    }, []);
    return (
        <div className={`w-full mx-auto ${className}`}>
            {/* Status Messages */}
            {paymentStatus === 'processing' && (
                <div className="mb-4 flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-500 mr-3 animate-spin" />
                    <span className="text-blue-800 font-medium">Procesando pago...</span>
                </div>
            )}

            {paymentStatus === 'success' && (
                <div className="mb-4 flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-green-800 font-medium">¡Pago exitoso!</span>
                </div>
            )}

            {paymentStatus === 'error' && (
                <div className="mb-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-800 font-medium">Error en el pago</span>
                </div>
            )}

            {paymentStatus === 'pending' && (
                <div className="mb-4 flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-yellow-800 font-medium">Pago pendiente</span>
                </div>
            )}

            {paymentStatus === 'rejected' && (
                <div className="mb-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-red-800 font-medium">Pago rechazado</span>
                </div>
            )}

            {/* Payment Brick Container */}
            <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={handleSubmit}
                onReady={handleReady}
                onError={handleError}
            />
        </div>
    );
};

// Export the old component name for backward compatibility
export const MercadoPagoCheckoutBrick = PaymentBrick; 