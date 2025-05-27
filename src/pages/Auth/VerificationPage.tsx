import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/services/auth/verifyEmailService';
import Button from '@/components/ui/buttons/Button';
import background from "/images/FondoDesktop.webp";


import { MailCheck } from 'lucide-react';
import { MailWarning } from 'lucide-react';
import Picture from '@/components/ui/Picture';

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
                return;
            }

            try {
                await verifyEmail(token);
                setStatus('success');

                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Email verificado exitosamente. Ahora puedes iniciar sesión.'
                        }
                    });
                }, 2000);
            } catch (err) {
                setStatus('error');
                setError(
                    err instanceof Error ? err.message : 'No pudimos verificar su correo electrónico. Asegúrese de que el enlace de verificación no haya caducado y haga clic en el botón "Reintentar".'
                );
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    return (
        <section className="min-h-screen bg-cover bg-center flex items-center justify-center text-black"
            style={{ backgroundImage: `url(${background})` }}>
            <div className="max-w-md w-full bg-white  rounded-lg shadow-md flex flex-col items-center p-8 gap-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {status === 'verifying' && 'Verificando tu email...'}
                        {status === 'success' && '¡Verificación exitosa!'}
                        {status === 'error' && 'Error en verificación'}
                    </h2>
                </div>

                <div className="text-center gap-8">
                    {status === 'verifying' && (
                        <>
                            <p className="text-gray-600">
                                Estamos confirmando tu dirección de email. Por favor espera...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <div className='flex flex-col items-center text-center gap-8'>
                            <Picture
                                icon={<MailCheck />}
                                alt="Verificación exitosa"
                            />
                            <p className="text-gray-600">
                                Tu email ha sido verificado correctamente. Serás redirigido automáticamente.
                            </p>
                            <div className="mt-4">
                                <Button onClick={() => navigate('/login')}>
                                    Ir al inicio de sesión
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className='flex flex-col items-center gap-4 '>
                            <Picture
                                icon={<MailWarning className='w-24 h-24 text-red-500' />}
                                alt="Error en verificación"
                            />

                            <p className="text-gray-600">
                                {error || (
                                    <>
                                        No pudimos verificar su correo electrónico. Asegúrese de que el enlace de verificación no haya caducado y haga clic en el botón
                                        <span className="text-primary font-semibold"> "Reintentar Registro" </span>.
                                    </>
                                )}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <Button onClick={() => navigate('/registro')}>
                                    Reintentar Registro
                                </Button>
                                <Button onClick={() => navigate('/contact')}>
                                    Actualizar Correo
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default EmailVerificationPage;
