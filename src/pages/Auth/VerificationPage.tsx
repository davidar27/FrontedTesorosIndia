/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/services/auth/verifyEmailService';
import { MailCheck, MailWarning } from 'lucide-react';
import AuthForm from '@/components/layouts/AuthForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

const emptySchema = z.object({});
type EmptyFormData = z.infer<typeof emptySchema>;

const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [Message, setMessage] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const { mutate: verifyEmailMutation } = useMutation({
        mutationFn: (token: string) => verifyEmail(token),
        onSuccess: (data) => {
            setStatus('success');
            setMessage('¡Email verificado exitosamente! Iniciando sesión...');
            setTimeout(() => {
                const userRole = data.user?.role;
                switch (userRole) {
                    case 'administrador':
                        navigate('/dashboard', {
                            state: { message: 'Email verificado exitosamente. ¡Bienvenido!' }
                        });
                        break;
                    case 'emprendedor':
                        navigate(`/experiencias/${data.user?.experience_id}`, {
                            state: { message: 'Email verificado exitosamente. ¡Bienvenido!' }
                        });
                        break;
                    case 'cliente':
                    default:
                        navigate('/', {
                            state: { message: 'Email verificado exitosamente. ¡Bienvenido!' }
                        });
                        break;
                }
                localStorage.removeItem('token');
            }, 2000);
        },
        onError: (err: any) => {
            let msg = 'No pudimos verificar su correo electrónico. Asegúrese de que el enlace de verificación no haya caducado.';

            if (err?.response?.data?.error?.message) {
                msg = err.response.data.error.message;
            } else if (err instanceof Error) {
                msg = err.message;
            }

            setStatus('error');
            setMessage(msg);
        }
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<EmptyFormData>({
        resolver: zodResolver(emptySchema)
    });

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No se encontró el token de verificación');
            return;
        }
        verifyEmailMutation(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <MailCheck className="w-24 h-24 text-green-500 " />;
            case 'error':
                return <MailWarning className="w-24 h-24 text-red-500 " />;
            case 'verifying':
                return <MailCheck className="w-24 h-24 text-primary " />;
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
                        <p className="text-green-600">Tu email ha sido verificado correctamente. Iniciando sesión automáticamente...</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex flex-col items-center space-y-4">
                        {getStatusIcon()}
                        <p className="text-red-600">{Message}</p>
                    </div>
                );
        }
    };

    const onSubmit = async () => {
        if (status === 'error') {
            navigate('/auth/registro');
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
            onChange={() => { }}
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