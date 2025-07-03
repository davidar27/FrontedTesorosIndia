import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/services/auth/resetPassword';
import { useMutation } from '@tanstack/react-query';
import AuthForm from '@/components/layouts/AuthForm';
import Card from '@/components/ui/cards/Card';
import CardContent from '@/components/ui/cards/CardContent';
import Button from '@/components/ui/buttons/Button';
import { useFieldValidation, passwordRules } from '@/hooks/useFieldValidation';
import background from "/images/FondoDesktop.webp";

const resetSchema = z.object({
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPasswordForm = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('reset_token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [Message, setMessage] = useState('');
    const [showValidations, setShowValidations] = useState<Record<string, boolean>>({});



    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        clearErrors,
        watch
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema)
    });

    const password = watch('password') || '';
    const validations = useFieldValidation(password, passwordRules);

    const { mutate: sendResetPassword } = useMutation({
        mutationFn: (data: ResetFormData) => resetPassword(token || '', data.password, data.confirmPassword),
        onSuccess: () => {
            setMessage('¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                navigate('/auth/iniciar-sesion', {
                    state: { message: '¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.' }
                });
                localStorage.removeItem('reset_token');
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

    const handleFocus = (fieldName: string) => {
        setShowValidations(prev => ({ ...prev, [fieldName]: true }));
    };

    if (!token) {
        return (
            <section className="min-h-screen bg-cover bg-center flex items-center justify-center text-black md:p-14"
                style={{ backgroundImage: `url(${background})` }}
            >
                <Card className="rounded-2xl shadow-lg p-4 max-w-lg mx-auto">
                    <CardContent className="flex flex-col items-center justify-center space-y-4 text-center" >
                        <AlertCircle
                            className="h-16 w-16  text-red-600 mb-4 mx-auto"
                        />
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Enlace inválido</h1>
                        <p className="text-gray-600 mb-6">
                            El enlace para restablecer la contraseña es inválido o ha expirado.
                            Por favor, solicita un nuevo enlace.
                        </p>
                        <Button
                            onClick={() => navigate('/auth/password/recuperar')}
                            className="w-full bg-primary hover:bg-primary-hover text-white"
                        >
                            Solicitar nuevo enlace
                        </Button>
                    </CardContent>
                </Card>
            </section>
        );
    }

    const fields = [
        {
            label: "Nueva contraseña",
            placeholder: "••••••••",
            type: showPassword ? "text" : "password",
            name: "password",
            validationRules: validations.validations,
            showValidation: showValidations.password,
            onFocus: () => handleFocus('password'),
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

    const messageStyle = {
        textColor: Message?.includes('éxito') ? 'text-green-600' : 'text-red-500',
        backgroundColor: Message?.includes('éxito') ? 'bg-green-50' : 'bg-red-50'
    };

    return (
        <AuthForm
            title="Restablece tu contraseña"
            subtitle="Ingresa tu nueva contraseña para continuar"
            fields={fields}
            submitText={isSubmitting ? "Cambiando contraseña..." : "Cambiar contraseña"}
            bottomText="¿Recordaste tu contraseña?"
            bottomLinkText="Inicia sesión"
            bottomLinkTo="/auth/iniciar-sesion"
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

export default ResetPasswordForm;