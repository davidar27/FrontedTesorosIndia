import { useState, useEffect } from 'react';
import { resendVerificationEmail } from '@/services/auth/resendService';
import { Mail, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import background from "/images/FondoDesktop.webp";
import Button from '@/components/ui/buttons/Button';
import Picture from '@/components/ui/Picture';

const RESEND_COOLDOWN = 60; // 60 segundos de cooldown

const SendEmail = () => {
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const location = useLocation();
    const email = location.state?.email;

    // Cargar cooldown persistente al montar el componente
    useEffect(() => {
        const savedCooldown = localStorage.getItem('emailCooldown');
        const savedTimestamp = localStorage.getItem('cooldownStart');

        if (savedCooldown && savedTimestamp) {
            const elapsedSeconds = Math.floor((Date.now() - Number(savedTimestamp)) / 1000);
            const remaining = Math.max(0, Number(savedCooldown) - elapsedSeconds);
            setCooldown(remaining);
        }
    }, []);

    // Manejar el temporizador y persistencia
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (cooldown > 0) {
            localStorage.setItem('emailCooldown', cooldown.toString());
            localStorage.setItem('cooldownStart', Date.now().toString());

            interval = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        localStorage.removeItem('emailCooldown');
                        localStorage.removeItem('cooldownStart');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
            if (cooldown <= 0) {
                localStorage.removeItem('emailCooldown');
                localStorage.removeItem('cooldownStart');
            }
        };
    }, [cooldown]);

    const handleResendEmail = async () => {
        if (isResending || cooldown > 0) return;

        setIsResending(true);
        setError('');
        setResendSuccess(false);

        try {
            await resendVerificationEmail(email);
            setResendSuccess(true);
            setCooldown(RESEND_COOLDOWN);
        } catch {
            setError('Error al reenviar el correo. Intenta nuevamente.');
        } finally {
            setIsResending(false);
        }
    };

    // Calcula el porcentaje para la barra de progreso
    const progressPercentage = (cooldown / RESEND_COOLDOWN) * 100;

    return (
        <section
            className="min-h-screen bg-cover bg-center flex items-center justify-center text-black md:p-14"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md w-full">
                <div className="flex flex-col items-center text-center">
                    <Picture
                        className="bg-green-500 rounded-full p-2 mb-4"
                        icon={<Mail className="h-16 w-16 text-white" />}
                    />


                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu correo electrónico</h2>

                    <p className="text-gray-600 mb-4">
                        Hemos enviado un enlace de verificación a <span className="font-semibold">{email}</span>.
                        Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar tu registro.
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 w-full">
                        <p className="text-yellow-700">
                            <strong>¿No ves el correo?</strong> Revisa tu carpeta de spam o solicita un nuevo enlace.
                        </p>
                    </div>

                    {/* Barra de progreso */}
                    {cooldown > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    )}

                    {/* Botón con estado gris durante cooldown */}
                    <Button
                        onClick={handleResendEmail}
                        disabled={isResending || cooldown > 0}
                        className={`w-full py-3 rounded-md font-medium transition-colors ${isResending
                            ? ''
                            : cooldown > 0
                                ? '!bg-gray-400 !text-gray-700 !cursor-not-allowed !border-none'
                                : 'bg-primary hover:bg-primary-hover text-white'
                            }`}
                    >
                        <div className="flex items-center justify-center">
                            {isResending ? (
                                <>
                                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                                    Enviando...
                                </>
                            ) : cooldown > 0 ? (
                                `Reenviar en ${cooldown}s`
                            ) : (
                                <>
                                    <Mail className="h-5 w-5 mr-2" />
                                    Reenviar correo
                                </>
                            )}
                        </div>
                    </Button>

                    {resendSuccess && (
                        <p className="mt-4 text-green-600 text-sm animate-fade-in">
                            ¡Correo reenviado con éxito! Revisa tu bandeja de entrada.
                        </p>
                    )}

                    {error && (
                        <p className="mt-4 text-red-600 text-sm animate-fade-in">
                            {error}
                        </p>
                    )}

                    <p className="mt-6 text-sm text-gray-500">
                        ¿No recibiste el correo?{' '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (cooldown <= 0) handleResendEmail();
                            }}
                            className={`${cooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'
                                }`}
                        >
                            {cooldown > 0 ? `Solicitar otro en ${cooldown}s` : 'Reenviar correo'}
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SendEmail;