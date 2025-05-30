import { useState } from 'react';
import { resendVerificationEmail } from '@/services/auth/resendService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetCooldown } from '@/hooks/useResetCooldown';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import AuthForm from '@/components/layouts/AuthForm';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const RESEND_COOLDOWN = 60;

const emailSchema = z.object({
    email: z.string()
        .email("Correo electrónico inválido")
        .min(1, "El correo es obligatorio"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const SendEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [Message, setMessage] = useState('');
    const [hideButton, setHideButton] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerified = () => {
        setIsVerified(true);
        setMessage('¡Email verificado con éxito! Redirigiendo al inicio de sesión...');
        setTimeout(() => {
            navigate('/login', {
                state: { message: '¡Email verificado con éxito! Ya puedes iniciar sesión.' }
            });
        }, 2000);
    };

    const { isChecking, error: verificationError } = useVerificationStatus({
        email: email || '',
        onVerified: handleVerified,
        pollingInterval: 3000 
    });

    const {
        cooldown,
        progressPercentage,
        startCooldown,
        isActive
    } = useResetCooldown({
        initialDuration: RESEND_COOLDOWN,
        storageKey: 'resendVerificationCooldown',
        onComplete: () => setHideButton(false)
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
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

        clearErrors();
        setMessage('');

        try {
            await resendVerificationEmail(data.email);
            setMessage('¡Correo reenviado con éxito! Revisa tu bandeja de entrada.');
            setHideButton(true);
            startCooldown();
        } catch {
            setMessage('Error al reenviar el correo. Intenta nuevamente.');
        }
    };

    const handleFormChange = () => {
        if (Message && !isVerified) {
            setMessage('');
            setHideButton(false);
        }
    };

    const getSubmitText = () => {
        if (isSubmitting) return "Enviando...";
        if (isActive) return `Reenviar en ${cooldown}s`;
        return "Reenviar correo de verificación";
    };

    const messageStyle = {
        textColor: Message?.includes('éxito') ? 'text-green-600' : 'text-red-500',
        backgroundColor: Message?.includes('éxito') ? 'bg-green-50' : 'bg-red-50'
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
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
                        <p className="text-yellow-700">
                            <strong>¿No ves el correo?</strong> Revisa tu carpeta de spam o solicita un nuevo enlace.
                        </p>
                    </div>
                    {(isActive || isChecking) && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${isChecking ? 100 : progressPercentage}%` }}
                            />
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
            Message={Message || verificationError || ''}
            messageStyle={messageStyle}
            errorType="general"
            isSubmitting={isSubmitting || isActive}
            hideSubmitButton={hideButton || isVerified}
        />
    );
};

export default SendEmail;