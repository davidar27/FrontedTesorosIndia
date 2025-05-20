import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/services/auth/verifyEmailService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/buttons/Button';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setError('No se encontró token de verificación');
                return;
            }

            try {
                await verifyEmail(token);
                setStatus('success');

                // Redirigir automáticamente después de 3 segundos
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Email verificado exitosamente. Ahora puedes iniciar sesión.'
                        }
                    });
                }, 3000);
            } catch (err) {
                setStatus('error');
                setError(
                    err instanceof Error ? err.message : 'Error al verificar el email'
                );
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {status === 'verifying' && 'Verificando tu email...'}
                        {status === 'success' && '¡Verificación exitosa!'}
                        {status === 'error' && 'Error en verificación'}
                    </h2>
                </div>

                <div className="mt-8 space-y-6 text-center">
                    {status === 'verifying' && (
                        <>
                            <LoadingSpinner className="w-12 h-12 mx-auto text-blue-600" />
                            <p className="text-gray-600">
                                Estamos confirmando tu dirección de email. Por favor espera...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <svg
                                className="mx-auto h-12 w-12 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <p className="text-gray-600">
                                Tu email ha sido verificado correctamente. Serás redirigido automáticamente.
                            </p>
                            <div className="mt-4">
                                <Button
                                    onClick={() => navigate('/login')}
                                >
                                    Ir al inicio de sesión
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <svg
                                className="mx-auto h-12 w-12 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            <p className="text-gray-600">
                                {error || 'Ocurrió un error al verificar tu email.'}
                            </p>
                            <div className="mt-4 space-y-4">
                                <Button
                                    onClick={() => navigate('/register')}
                                >
                                    Registrarse nuevamente
                                </Button>
                                <Button
                                    onClick={() => navigate('/contact')}
                                >
                                    Contactar soporte
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


export default EmailVerificationPage;