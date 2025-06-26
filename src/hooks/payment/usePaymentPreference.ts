/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { CreatePreferencePayload } from "@/features/payment/paymentTypes";

const TAX_RATE = 0.21;

export const usePaymentPreference = (items: any[]) => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const createPreference = useCallback(async () => {
        if (items.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const finalTotal = items.reduce(
                (acc, item) => acc + (item.priceWithTax * item.quantity),
                0
            ) * (1 + TAX_RATE);

            const payload: CreatePreferencePayload = {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data?.preferenceId) {
                setPreferenceId(data.preferenceId);
            } else {
                throw new Error('No se recibió preferenceId del servidor');
            }
        } catch (error) {
            console.error('Error creating preference:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    }, [items]);

    useEffect(() => {
        const urlPreferenceId = searchParams.get('preferenceId');
        if (urlPreferenceId) {
            setPreferenceId(urlPreferenceId);
        } else if (items.length > 0) {
            createPreference();
        }
    }, [searchParams, items, createPreference]);

    return {
        preferenceId,
        isLoading,
        error,
        createPreference,
    };
};
