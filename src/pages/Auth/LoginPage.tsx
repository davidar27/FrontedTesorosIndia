import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '@/context/AuthContext';
import { loginSchema } from "@/validations/auth/loginSchema";
import { Credentials } from '@/interfaces/formInterface';
import AuthForm from '@/components/layouts/AuthForm';

const LoginPage = () => {
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<Credentials>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = async (credentials: Credentials) => {
        setErrorMessage("");
        try {
            await login(credentials);
            navigate("/", { replace: true });
        } catch (error) {
            reset({ password: '' });
            setErrorMessage(
                error instanceof Error ? error.message : "Error desconocido"
            );
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
            submitText={isSubmitting ? "Procesando..." : "Ingresar"}
            extraLinkText="¿Has olvidado la contraseña?"
            extraLinkTo="/recuperar"
            bottomText="¿No tienes cuenta?"
            bottomLinkText="Regístrate"
            bottomLinkTo="/registro"
            errorMessage={errorMessage}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={() => errorMessage && setErrorMessage("")}
        />
    );
};

export default LoginPage;