import { useState, useEffect } from 'react';

interface UseResetCooldownProps {
    initialDuration: number;
    storageKey?: string;
    onComplete?: () => void;
}

export const useResetCooldown = ({ initialDuration, storageKey = 'resetPasswordCooldown', onComplete }: UseResetCooldownProps) => {
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const savedCooldown = localStorage.getItem(storageKey);
        const savedTimestamp = localStorage.getItem(`${storageKey}Start`);

        if (savedCooldown && savedTimestamp) {
            const elapsedSeconds = Math.floor((Date.now() - Number(savedTimestamp)) / 1000);
            const remaining = Math.max(0, Number(savedCooldown) - elapsedSeconds);
            setCooldown(remaining);
        }
    }, [storageKey]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (cooldown > 0) {
            localStorage.setItem(storageKey, cooldown.toString());
            localStorage.setItem(`${storageKey}Start`, Date.now().toString());

            interval = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        localStorage.removeItem(storageKey);
                        localStorage.removeItem(`${storageKey}Start`);
                        if (onComplete) {
                            onComplete();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
            if (cooldown <= 0) {
                localStorage.removeItem(storageKey);
                localStorage.removeItem(`${storageKey}Start`);
            }
        };
    }, [cooldown, storageKey, onComplete]);

    const startCooldown = () => setCooldown(initialDuration);
    const progressPercentage = (cooldown / initialDuration) * 100;

    return {
        cooldown,
        progressPercentage,
        startCooldown,
        isActive: cooldown > 0
    };
}; 