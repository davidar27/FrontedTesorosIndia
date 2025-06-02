/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { axiosInstance } from '@/api/axiosInstance';

interface UseVerificationStatusProps {
    email: string;
    onVerified: () => void;
    pollingInterval?: number;
    maxDuration?: number;
    enabled?: boolean;
}

interface VerificationResponse {
    isVerified: boolean;
    details: string;
    attemptCount?: number;
    maxAttempts?: number;
    retryAfter?: number;
}

export const useVerificationStatus = ({
    email,
    onVerified,
    pollingInterval = 5000,
    maxDuration = 120000,
    enabled = true
}: UseVerificationStatusProps) => {
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);
    const startTimeRef = useRef<number>(0);

    const clearPolling = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const checkVerificationStatus = useCallback(async (): Promise<boolean> => {
        if (!email || !mountedRef.current || isVerified) return true;

        try {
            const response = await axiosInstance.get<VerificationResponse>(
                `/auth/verificacion?email=${encodeURIComponent(email)}`
            );

            if (!mountedRef.current) return true;

            if (response.data.isVerified) {
                setIsVerified(true);
                setIsChecking(false);
                onVerified();
                return true;
            }

            if (response.data.maxAttempts && response.data.attemptCount) {
                const remaining = response.data.maxAttempts - response.data.attemptCount;
                setAttemptsLeft(remaining);

                if (remaining <= 0) {
                    setError('Se han agotado los intentos de verificación. Por favor, intente más tarde.');
                    setIsChecking(false);
                    return true;
                }
            }

            return false;
        } catch (error: any) {
            if (!mountedRef.current) return true;

            if (error.response?.status === 429) {
                const retryAfter = error.response.data?.retryAfter || 5;
                setError(`Verificaciones muy frecuentes. Esperando ${retryAfter} segundos...`);

                const waitTime = Math.max(retryAfter * 1000, 5000);
                return new Promise(resolve => {
                    timeoutRef.current = setTimeout(() => {
                        if (mountedRef.current) {
                            setError(null);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }, waitTime);
                });
            }

            console.warn('Error en verificación:', error.response?.data || error.message);
            return false;
        }
    }, [email, onVerified, isVerified]);

    const startPolling = useCallback(async (isInitial = false) => {
        if (!mountedRef.current || !enabled || isVerified) return;

        if (isInitial) {
            setIsChecking(true);
            setError(null);

            timeoutRef.current = setTimeout(() => {
                if (mountedRef.current && !isVerified) {
                    startPolling(false);
                }
            }, 5000);
            return;
        }

        setIsChecking(true);
        setError(null);

        try {
            const shouldStop = await checkVerificationStatus();
            const elapsedTime = Date.now() - startTimeRef.current;

            if (!mountedRef.current || isVerified) return;

            if (shouldStop) {
                setIsChecking(false);
                return;
            }

            if (elapsedTime >= maxDuration) {
                setIsChecking(false);
                setError('Tiempo de verificación agotado. Por favor, intente nuevamente.');
                return;
            }

            const actualInterval = Math.max(pollingInterval, 5000);
            timeoutRef.current = setTimeout(() => {
                startPolling(false);
            }, actualInterval);

        } catch {
            if (mountedRef.current) {
                setIsChecking(false);
                setError('Error inesperado durante la verificación.');
            }
        }
    }, [enabled, isVerified, checkVerificationStatus, pollingInterval, maxDuration]);

    useEffect(() => {
        mountedRef.current = true;
        startTimeRef.current = Date.now();

        if (email && enabled && !isVerified) {
            startPolling(true);
        }

        return () => {
            mountedRef.current = false;
            clearPolling();
        };
    }, [email, enabled, startPolling, clearPolling, isVerified]);

    const restart = useCallback(() => {
        setIsVerified(false);
        setError(null);
        setAttemptsLeft(null);
        clearPolling();
        startTimeRef.current = Date.now();
        if (email && enabled) {
            startPolling(true);
        }
    }, [email, enabled, startPolling, clearPolling]);

    const stop = useCallback(() => {
        setIsChecking(false);
        clearPolling();
    }, [clearPolling]);

    return {
        isChecking,
        error,
        attemptsLeft,
        isVerified,
        restart,
        stop
    };
};