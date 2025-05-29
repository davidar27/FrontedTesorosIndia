import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/services/auth/resetPassword';
import { useMutation } from '@tanstack/react-query';
import AuthForm from '@/components/layouts/AuthForm';
import Card from '@/components/ui/cards/Card';
import CardContent from '@/components/ui/cards/CardContent';
import Button from '@/components/ui/buttons/Button';

const resetSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const { mutate: sendResetPassword } = useMutation({
    mutationFn: (data: ResetFormData) => resetPassword(token || '', data.password, data.confirmPassword),
    onSuccess: () => {
      setMessage('¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.' }
        });
      }, 3000);
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : 'Error al restablecer la contraseña');
    }
  });

  const onSubmit = async (data: ResetFormData) => {
    clearErrors();
    sendResetPassword(data);
  };

  const handleFormChange = () => {
    if (Message) {
      setMessage('');
    }
  };

  if (!token) {
    return (
      <Card className="rounded-2xl shadow-lg p-8 max-w-lg">
        <CardContent>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Enlace inválido</h1>
            <p className="text-gray-600 mb-6">
              El enlace para restablecer la contraseña es inválido o ha expirado.
              Por favor, solicita un nuevo enlace.
            </p>
            <Button
              onClick={() => navigate('/recuperar-contraseña')}
              className="w-full bg-primary hover:bg-primary-hover text-white"
            >
              Solicitar nuevo enlace
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fields = [
    {
      label: "Nueva contraseña",
      placeholder: "••••••••",
      type: showPassword ? "text" : "password",
      name: "password",
      rightElement: (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )
    },
    {
      label: "Confirmar contraseña",
      placeholder: "••••••••",
      type: showConfirmPassword ? "text" : "password",
      name: "confirmPassword",
      rightElement: (
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )
    }
  ];

  return (
    <AuthForm
      title="Restablece tu contraseña"
      subtitle="Ingresa tu nueva contraseña para continuar"
      fields={fields}
      submitText={isSubmitting ? "Cambiando contraseña..." : "Cambiar contraseña"}
      bottomText="¿Recordaste tu contraseña?"
      bottomLinkText="Inicia sesión"
      bottomLinkTo="/login"
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      register={register}
      errors={errors}
      Message={Message}
      errorType="general"
      isSubmitting={isSubmitting}
    />
  );
};

export default ResetPasswordForm;