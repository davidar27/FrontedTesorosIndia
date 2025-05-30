import { useState } from 'react';
import { resendVerificationEmail } from '@/services/auth/resendService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetCooldown } from '@/hooks/useResetCooldown';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import AuthForm from '@/components/layouts/AuthForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthError } from '@/interfaces/responsesApi';
import { ProgressBar } from '@/components/ui/display/ProgressBar';

const RESEND_COOLDOWN = 60;

const emailSchema = z.object({
    email: z.string()
        .email("Correo electrónico inválido")
        .min(1, "El correo es obligatorio")
        .trim(),
});

type EmailFormData = z.infer<typeof emailSchema>;

const SendEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [message, setMessage] = useState('');

    const {
        isVerified,
        restart
    } = useVerificationStatus({
        email: email || '',
        onVerified: () => {
            navigate('/login', {
                state: {
                    message: 'Correo verificado exitosamente. Ya puedes iniciar sesión.',
                    email: email
                }
            });
        },
        pollingInterval: 6000,
        maxDuration: 300000
    });

    const {
        cooldown,
        progressPercentage,
        startCooldown,
        isActive
    } = useResetCooldown({
        initialDuration: RESEND_COOLDOWN,
        storageKey: 'resendVerificationCooldown'
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: email || ''
        }
    });

    const onSubmit = async (data: EmailFormData) => {
        if (isActive) {
            setMessage(`Por favor espera ${cooldown} segundos antes de solicitar otro correo`);
            return;
        }

        if (isVerified) {
            setMessage('Tu correo ya ha sido verificado');
            return;
        }

        clearErrors();
        setMessage('');

        try {
            const result = await resendVerificationEmail(data.email);
            setMessage(result.message);
            startCooldown();
            restart(); // Reiniciar la verificación
        } catch (error) {
            if (error instanceof AuthError) {
                setMessage(error.message);
            } else {
                setMessage('Error al reenviar el correo. Por favor, intenta nuevamente.');
            }
        }
    };

    const handleFormChange = () => {
        if (message && !isVerified) {
            setMessage('');
        }
    };

    const getSubmitText = () => {
        if (isActive) return `Reenviar en ${cooldown}s`;
        return "Reenviar correo de verificación";
    };

    const getMessageStyle = () => {
        if (!message) return {};

        if (message.includes('éxito')) {
            return {
                textColor: 'text-green-600',
                backgroundColor: 'text-green-600'
            };
        }

        if (message.includes('Error')) {
            return {
                textColor: 'text-red-500',
                backgroundColor: 'bg-red-50'
            };
        }

        return {
            textColor: 'text-green-600',
            backgroundColor: 'text-green-600'
        };
    };

    return (
        <AuthForm
            title="Verifica tu correo electrónico"
            subtitle={
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Hemos enviado un enlace de verificación a tu <span className="!font-bold !text-black">{email}</span>.
                        Por favor revisa tu bandeja de entrada y haz clic en el enlace para completar tu registro.
                    </p>

                    {/* Barra de progreso */}
                    {isActive && (
                        <div className="space-y-2">
                            <ProgressBar 
                                progress={progressPercentage} 
                                className="w-full"
                                barClassName="!bg-primary"
                            />
                            <p className="text-xs text-center text-gray-500">
                                Espera {cooldown} segundos para reenviar
                            </p>
                        </div>
                    )}
                </div>
            }
            submitText={getSubmitText()}
            bottomText="¿Necesitas ayuda?"
            bottomLinkText="Contacta con soporte"
            bottomLinkTo="/contacto"
            onSubmit={handleSubmit(onSubmit)}
            onChange={handleFormChange}
            register={register}
            errors={errors}
            Message={message}
            messageStyle={getMessageStyle()}
            errorType="general"
            isSubmitting={isActive}
            hideSubmitButton={isActive || isVerified}
        />
    );
};

export default SendEmail;