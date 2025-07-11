import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { cancelReserveService, getReserveDataService, ReserveData } from '@/services/reserve/cancelReserveService';

export const useCancelReserve = () => {
    const [searchParams] = useSearchParams();
    const [reserveData, setReserveData] = useState<ReserveData | null>(null);
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

    const token = localStorage.getItem('token') || searchParams.get('token');

    // Verificar token y obtener datos de la reserva
    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const data = await getReserveDataService(token);
                setReserveData(data);
                setIsValidToken(true);
            } catch (error) {
                console.error('Error verificando token:', error);
                // Si el error es específico del token, marcamos como inválido
                if (error instanceof Error && (
                    error.message.includes('Token expirado') ||
                    error.message.includes('Token inválido')
                )) {
                    setIsValidToken(false);
                } else {
                    // Para otros errores, también marcamos como inválido por seguridad
                    setIsValidToken(false);
                }
            }
        };

        verifyToken();
    }, [token]);

    const cancelReserveMutation = useMutation({
        mutationFn: ({ token, reserveId }: { token: string; reserveId: number }) =>
            cancelReserveService(token, reserveId),
    });

    const handleCancelReserve = () => {
        if (!token || !reserveData) return;

        cancelReserveMutation.mutate({
            token,
            reserveId: reserveData.reserve_id
        });
    };

    return {
        token,
        reserveData,
        isValidToken,
        cancelReserveMutation,
        handleCancelReserve
    };
}; 