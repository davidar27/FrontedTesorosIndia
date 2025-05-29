import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/services/auth/verifyEmailService';
import { MailCheck, MailWarning } from 'lucide-react';
import AuthForm from '@/components/layouts/AuthForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const emptySchema = z.object({});
type EmptyFormData = z.infer<typeof emptySchema>;

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [Message, setMessage] = useState<string | null>(null);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<EmptyFormData>({
        resolver: zodResolver(emptySchema)
    });

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('No se encontró el token de verificación');
                return;
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await verifyEmail(token);
                setStatus('success');
                setMessage('¡Email verificado exitosamente! Serás redirigido al inicio de sesión...');

                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Email verificado exitosamente. Ahora puedes iniciar sesión.'
                        }
                    });
                }, 2000);
            } catch (err) {
                setStatus('error');
                setMessage(
                    err instanceof Error ? err.message : 'No pudimos verificar su correo electrónico. Asegúrese de que el enlace de verificación no haya caducado.'
                );
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <MailCheck className="w-24 h-24 text-green-500 animate-bounce" />;
            case 'error':
                return <MailWarning className="w-24 h-24 text-red-500 animate-pulse" />;
            case 'verifying':
                return <MailCheck className="w-24 h-24 text-primary animate-pulse" />;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (status) {
            case 'verifying':
                return 'Verificando tu email...';
            case 'success':
                return '¡Verificación exitosa!';
            case 'error':
                return 'Error en verificación';
        }
    };

    const getSubtitle = () => {
        switch (status) {
            case 'verifying':
                return (
                    <div className="flex flex-col items-center space-y-4">
                        {getStatusIcon()}
                        <p>Estamos confirmando tu dirección de email. Por favor espera...</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col items-center space-y-4">
                        {getStatusIcon()}
                        <p className="text-green-600">Tu email ha sido verificado correctamente. Serás redirigido automáticamente.</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex flex-col items-center space-y-4">
                        {getStatusIcon()}
                        <p>{Message}</p>
                    </div>
                );
        }
    };

    const onSubmit = async () => {
        if (status === 'error') {
            navigate('/registro');
        }
    };

    return (
        <AuthForm
            title={getTitle()}
            subtitle={getSubtitle()}
            fields={[]}
            submitText={status === 'error' ? "Reintentar registro" : ""}
            bottomText={status === 'error' ? "¿Necesitas ayuda?" : ""}
            bottomLinkText={status === 'error' ? "Contacta con soporte" : ""}
            bottomLinkTo={status === 'error' ? "/contacto" : ""}
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {}}
            // @ts-expect-error - Este formulario no tiene campos, por lo que el register no se usa
            register={() => ({})}
            errors={{}}
            errorType="general"
            isSubmitting={isSubmitting || status === 'verifying'}
            hideSubmitButton={status !== 'error'}
        />
    );
};

export default EmailVerificationPage;
