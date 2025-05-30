import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from '@/context/useAuth';
import { z } from "zod";
import AuthForm from "@/components/layouts/AuthForm";
import { AuthError } from '@/interfaces/responsesApi';

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/^\S*$/, "La contraseña no puede contener espacios")
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const { login } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [Message, setMessage] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError: setFormError,
        clearErrors
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsRedirecting(false);
        clearErrors();
        setMessage('');

        try {
            const user = await login(data);
            setMessage('¡Inicio de sesión exitoso!');
            setIsRedirecting(true);

            if (user.role === 'administrador') {
                navigate('/dashboard');
            } else {
                navigate("/", { replace: true });
            }
        } catch (error) {
            setIsRedirecting(false);

            if (error instanceof AuthError) {
                if (error.errorType === 'general') {
                    setFormError('email', {
                        type: 'manual',
                        message: error.message
                    });
                    setFormError('password', {
                        type: 'manual',
                        message: error.message
                    });
                }
                setMessage(error.message);
            }
            throw error;
        }
    };

    const handleFormChange = () => {
        if (isRedirecting) {
            setIsRedirecting(false);
        }
        if (Message) {
            setMessage('');
        }
        if (Object.keys(errors).length > 0) {
            clearErrors();
        }
    };

    const fields = [
        {
            label: "Correo electrónico",
            placeholder: "correo@ejemplo.com",
            type: "email",
            name: "email",
        },
        {
            label: "Contraseña",
            placeholder: "••••••••",
            type: "password",
            name: "password",
        },
    ];

    const messageStyle = {
        textColor: Message?.includes('éxito') ? 'text-green-600' : 'text-red-500',
        backgroundColor: Message?.includes('éxito') ? 'bg-green-50' : 'bg-red-50'
    };

    return (
        <AuthForm
            title="Inicio de sesión"
            subtitle="Inicia  sesión con tu cuenta de"
            bold="Tesoros India"
            fields={fields}
            submitText={isSubmitting ? "Procesando..." :
                isRedirecting ? "Redirigiendo..." : "Iniciar sesión"}
            bottomText="¿No tienes una cuenta?"
            bottomLinkText="Regístrate aquí"
            bottomLinkTo="/registro"
            extraLinkText="¿Olvidaste tu contraseña?"
            extraLinkTo="/recuperar-contraseña"
            onSubmit={handleSubmit(onSubmit)}
            loadingText="Iniciando sesión..."
            Message={Message}
            messageStyle={messageStyle}
            onChange={handleFormChange}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting || isRedirecting}
        />
    );
};

export default LoginPage;