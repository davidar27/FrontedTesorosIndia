import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '@/context/useAuth';
import { loginSchema } from "@/validations/auth/loginSchema";
import { Credentials } from '@/interfaces/formInterface';
import AuthForm from '@/components/layouts/AuthForm';
import { AuthError } from '@/interfaces/responsesApi';

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
    } = useForm<Credentials>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = async (credentials: Credentials) => {
        setIsRedirecting(false);
        clearErrors();

        try {
            const user = await login(credentials);

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
            label: "Email",
            placeholder: "usuario@ejemplo.com",
            type: "email",
            name: "email",
            autoComplete: "username"
        },
        {
            label: "Contraseña",
            placeholder: "Ingresa tu contraseña",
            type: "password",
            name: "password",
            autoComplete: "current-password"
        },
    ];

    return (
        <AuthForm
            title="Iniciar sesión"
            subtitle="Inicia sesión con tu cuenta de"
            bold="Tesoros de la India"
            fields={fields}
            submitText={isSubmitting ? "Procesando..." :
                isRedirecting ? "Redirigiendo..." : "Ingresar"}
            extraLinkText="¿Has olvidado la contraseña?"
            extraLinkTo="/restablecer-contraseña"
            bottomText="¿No tienes cuenta?"
            bottomLinkText="Regístrate"
            bottomLinkTo="/registro"
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting || isRedirecting}
            onChange={handleFormChange}
        />
    );
};

export default LoginPage;