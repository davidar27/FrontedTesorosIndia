import { useState, useEffect } from 'react';
import { axiosInstance } from '@/api/axiosInstance';

interface UseVerificationStatusProps {
    email: string;
    onVerified: () => void;
    pollingInterval?: number;
}

export const useVerificationStatus = ({ 
    email, 
    onVerified, 
    pollingInterval = 3000 
}: UseVerificationStatusProps) => {
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let mounted = true;

        const checkVerificationStatus = async () => {
            if (!email || !mounted) return;

            try {
                const response = await axiosInstance.get(`/auth/revisar-verificacion?email=${encodeURIComponent(email)}`);
                
                if (response.data.isVerified && mounted) {
                    onVerified();
                    return true;
                }
                return false;
            } catch  {
                if (mounted) {
                    setError('Error al verificar el estado del correo');
                }
                return false;
            }
        };

        const startPolling = async () => {
            setIsChecking(true);
            setError(null);

            const isVerified = await checkVerificationStatus();
            
            if (!isVerified && mounted) {
                timeoutId = setTimeout(startPolling, pollingInterval);
            } else {
                setIsChecking(false);
            }
        };

        startPolling();

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
        };
    }, [email, onVerified, pollingInterval]);

    return {
        isChecking,
        error
    };
}; 