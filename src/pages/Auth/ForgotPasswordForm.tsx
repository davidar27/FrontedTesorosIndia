import { sendPasswordResetEmail } from '@/services/auth/sendPasswordResetEmail';
import { useMutation } from '@tanstack/react-query';
import { useResetCooldown } from '@/hooks/useResetCooldown';
import AuthForm from '@/components/layouts/AuthForm';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const RESEND_COOLDOWN = 60;

const resetSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type ResetFormData = z.infer<typeof resetSchema>;

const ForgotPasswordForm = () => {
  const [Message, setMessage] = useState('');
  const location = useLocation();
  const email = location.state?.email;

  const { startCooldown, isActive } = useResetCooldown({
    initialDuration: RESEND_COOLDOWN
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
    onSuccess: (_, email) => {
      setMessage(`¡Correo enviado con éxito! Se han enviado las instrucciones para restablecer tu contraseña a ${email}`);
      startCooldown();
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : 'Error al enviar el correo');
    }
  });

  const onSubmit = async (data: ResetFormData) => {
    if (isActive) {
      setMessage('Por favor espera antes de solicitar otro correo');
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

  const fields = [
    {
      label: "Correo electrónico",
      placeholder: "correo@ejemplo.com",
      type: "email",
      name: "email"
    }
  ];

  const messageStyle = {
    textColor: Message?.includes('éxito') ? 'text-green-600' : 'text-red-500',
    backgroundColor: Message?.includes('éxito') ? 'bg-green-50' : 'bg-red-50'
  };

  return (
    <AuthForm
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña"
      fields={fields}
      submitText={isSubmitting ? "Enviando..." : "Enviar enlace"}
      bottomText="¿Recordaste tu contraseña?"
      bottomLinkText="Volver al inicio de sesión"
      bottomLinkTo="/login"
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      register={register}
      errors={errors}
      Message={Message}
      messageStyle={messageStyle}
      errorType="general"
      isSubmitting={isSubmitting}
    />
  );
};

export default ForgotPasswordForm;