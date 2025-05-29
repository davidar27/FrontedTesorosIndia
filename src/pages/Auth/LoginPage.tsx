import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/useAuth';
import { z } from "zod";
import AuthForm from "@/components/layouts/AuthForm";
import { AuthError } from '@/interfaces/responsesApi';

const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const { login } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);
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

        try {
            const user = await login(data);

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
            }
            throw error;
        }
    };

    const handleFormChange = () => {
        if (isRedirecting) {
            setIsRedirecting(false);
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
                onChange={handleFormChange}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting || isRedirecting}
            />
    );
};

export default LoginPage;