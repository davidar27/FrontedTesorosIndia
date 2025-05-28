import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import background from "/images/FondoDesktop.webp";
import BackButton from '@/components/ui/buttons/BackButton';
import Button from '@/components/ui/buttons/Button';
import imgLogo from "@/assets/icons/logotesorosindiaPequeño.webp";
import CircularLogo from '@/components/ui/CircularLogo';
import Card from '@/components/ui/cards/Card';
import CardContent from '@/components/ui/cards/CardContent';

// Esquema de validación con Yup
const schema = yup.object({
  email: yup.string().email('Correo inválido').required('Correo requerido'),
}).required();

type FormData = yup.InferType<typeof schema>;

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Mutación para enviar el correo usando React Query
  const { mutate, isPending } = useMutation({
    mutationFn: (email: string) =>
      axios.post('/auth/recuperar-contraseña', { email }),
    onSuccess: () => {
      setSuccessMessage('¡Enlace enviado! Revisa tu correo electrónico.');
    },
    onError: () => {
      setSuccessMessage('');
    }
  });

  const onSubmit = (data: FormData) => {
    mutate(data.email);
  };

  return (
    <section className="min-h-screen bg-cover bg-center flex items-center justify-center text-black md:p-14"
      style={{ backgroundImage: `url(${background})` }}>
      <Card className="rounded-2xl shadow-lg p-8 max-w-lg relative pt-20">
      <CardContent>
          <CircularLogo
            src={imgLogo}
            alt="Tesoros de la India"
            size="xl"
            borderColor="none"
            shadow="lg"
            offsetY="-50px"
          />
          <BackButton
            to="/"
            position="top-left"
            size="lg"
            color="black"
            hoverColor="blue-700"
            className="p-2"
            iconClassName="stroke-2"
          />
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Cambiar contraseña</h1>
            <p className="text-gray-600">
              Introduce tu dirección de correo electrónico para que te enviemos un enlace con el que restablezcas tu contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                placeholder="tucorreo@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 rounded-md font-medium text-white flex items-center justify-center ${isPending ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar enlace
                </>
              )}
            </Button>

            {successMessage && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md animate-fade-in">
                {successMessage}
              </div>
            )}
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            ¿Recordaste tu contraseña?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Inicia sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ForgotPasswordForm;