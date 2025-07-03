import { sendPasswordResetEmail } from '@/services/auth/sendPasswordResetEmail';
import { useMutation } from '@tanstack/react-query';
import { useResetCooldown } from '@/hooks/useResetCooldown';
import AuthForm from '@/components/layouts/AuthForm';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ProgressBar } from '@/components/ui/display/ProgressBar';

const RESEND_COOLDOWN = 60;

const resetSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type ResetFormData = z.infer<typeof resetSchema>;

const ForgotPasswordForm = () => {
  const [Message, setMessage] = useState('');
  const [lastEmail, setLastEmail] = useState<string>('');
  const location = useLocation();
  const email = location.state?.email;

  const {
    cooldown,
    progressPercentage,
    startCooldown,
    isActive
  } = useResetCooldown({
    initialDuration: RESEND_COOLDOWN,
    storageKey: 'resetPasswordCooldown'
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: email || ''
    }
  });

  const { mutate: sendResetEmail } = useMutation({
    mutationFn: (email: string) => sendPasswordResetEmail(email),
    onSuccess: (response, email) => {
      if (response.success) {
        setLastEmail(email);
        setMessage(`¡Correo enviado con éxito! Se han enviado las instrucciones para restablecer tu contraseña a ${email}`);
        startCooldown();
      } else {
        setMessage(response.message || 'Error al enviar el correo');
      }
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : 'Error al enviar el correo');
    }
  });

  const onSubmit = async (data: ResetFormData) => {
    if (isActive) {
      setMessage(`Por favor espera ${cooldown} segundos antes de solicitar otro correo`);
      return;
    }
    clearErrors();
    sendResetEmail(data.email);
  };

  const handleFormChange = () => {
    if (Message) {
      setMessage('');
    }
  };

  const fields = !isActive ? [
    {
      label: "Correo electrónico",
      placeholder: "correo@ejemplo.com",
      type: "email",
      name: "email"
    }
  ] : [];

  const messageStyle = {
    textColor: Message?.includes('éxito') ? 'text-green-600' : 'text-red-500',
    backgroundColor: Message?.includes('éxito') ? 'bg-green-50' : 'bg-red-50'
  };

  return (
    <AuthForm
      title="Recuperar contraseña"
      subtitle={
        <div className="space-y-4">
          {!isActive ? (
            <p className="text-sm text-gray-600">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          ) : (
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                Se ha enviado un enlace de recuperación a:
              </p>
              <p className="font-medium text-gray-900">
                {lastEmail}
              </p>
              <p className="mt-2">
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
              <div className="space-y-2 mt-4">
                <ProgressBar
                  progress={progressPercentage}
                  className="w-full"
                  barClassName="!bg-primary"
                />
                <p className="text-xs text-center text-gray-500">
                  Podrás solicitar otro correo en {cooldown} segundos
                </p>
              </div>
            </div>
          )}
        </div>
      }
      fields={fields}
      submitText={isSubmitting ? "Enviando..." : "Enviar enlace"}
      bottomText="¿Recordaste tu contraseña?"
      bottomLinkText="Volver al inicio de sesión"
      bottomLinkTo="/auth/iniciar-sesion"
      extraLinkTo='/auth/registrar'
      extraLinkText='¿Registrate?'
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      register={register}
      errors={errors}
      Message={Message}
      messageStyle={messageStyle}
      errorType="general"
      isSubmitting={isSubmitting}
      hideSubmitButton={isActive}
    />
  );
};

export default ForgotPasswordForm;