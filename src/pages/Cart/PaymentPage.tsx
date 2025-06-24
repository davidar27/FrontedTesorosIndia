import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaymentBrick } from "./PaymentBrick";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import {  CreditCard, Shield, CheckCircle } from "lucide-react";
import Button from "@/components/ui/buttons/Button";

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { items, total, handleClearCart } = useCart();
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'pending' | 'rejected'>('idle');

    const finalTotal = total + total * 0.19;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    // Get preferenceId from URL params or create one
    useEffect(() => {
        const urlPreferenceId = searchParams.get('preferenceId');
        if (urlPreferenceId) {
            setPreferenceId(urlPreferenceId);
        } else if (items.length > 0) {
            // Create preference if not provided
            createPreference();
        }
    }, [searchParams, items]);

    const createPreference = async () => {
        setIsLoading(true);
        try {
            const payload = {
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.priceWithTax,
                })),
                total: finalTotal,
            };

            const response = await fetch('/api/pagos/preferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data && data.preferenceId) {
                setPreferenceId(data.preferenceId);
            }
        } catch (error) {
            console.error('Error creating preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentData: unknown) => {
        setPaymentStatus('success');
        // Clear cart after successful payment
        setTimeout(() => {
            handleClearCart();
            navigate('/payment-success', {
                state: {
                    paymentData,
                    items,
                    total: finalTotal
                }
            });
        }, 2000);
    };

    const handlePaymentError = (error: unknown) => {
        setPaymentStatus('error');
        console.error('Payment error:', error);
    };

    const handlePaymentPending = (paymentData: unknown) => {
        setPaymentStatus('pending');
        navigate('/payment-pending', {
            state: {
                paymentData,
                items,
                total: finalTotal
            }
        });
    };

    const handlePaymentRejected = (paymentData: unknown) => {
        setPaymentStatus('rejected');
        navigate('/payment-failure', {
            state: {
                paymentData,
                items,
                total: finalTotal
            }
        });
    };



    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Carrito vacío</h1>
                    <p className="text-gray-600 mb-6">No hay productos en tu carrito para procesar el pago.</p>
                    <Button onClick={() => navigate('/')} variant="primary">
                        Continuar comprando
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 responsive-padding-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {isLoading && !preferenceId ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                            <span className="ml-3 text-gray-600">Preparando pago...</span>
                        </div>
                    ) : preferenceId ? (
                        <PaymentBrick
                            preferenceId={preferenceId}
                            amount={finalTotal}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            onPending={handlePaymentPending}
                            onRejected={handlePaymentRejected}
                        />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Error al cargar el método de pago</p>
                            <Button
                                onClick={createPreference}
                                variant="primary"
                                className="mt-4"
                            >
                                Reintentar
                            </Button>
                        </div>
                    )}



                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Resumen de la Orden
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Productos ({totalItems})</span>
                                    <span className="font-medium">{formatPrice(total)}</span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">IVA (19%)</span>
                                    <span className="font-medium">{formatPrice(total * 0.19)}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-lg px-4">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-emerald-600">
                                        {formatPrice(finalTotal)}
                                    </span>
                                </div>
                            </div>

                            {/* Security Features */}
                            <div className="sticky top-20 pt-6 border-t border-gray-200">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm text-gray-600">Pago 100% seguro</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm text-gray-600">Encriptación SSL</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CreditCard className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm text-gray-600">Múltiples métodos de pago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage; 