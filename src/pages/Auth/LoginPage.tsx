import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from 'js-cookie';
import AuthForm from '@/components/layouts/AuthForm';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/auth/authService';
import { loginSchema } from "@/validations/auth/loginSchema";
import { LoginFormData } from '@/types/auth/authTypes';
import { AxiosError } from 'axios';

const LoginPage = () => {
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const isProduction = process.env.NODE_ENV === 'production';


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema)
    });



    const onSubmit = async (data: LoginFormData) => {
        setErrorMessage("");

        try {
            const response = await authService.login(data.email, data.password);

            console.log(response);
            
            login();

            const cookieOptions = {
                expires: 7,
                secure: isProduction,
                sameSite: isProduction ? 'None' as const : 'Lax' as const,
                path: '/',
            };

            

            Cookies.set("user_name", response.name, cookieOptions);

            navigate("/", { replace: true });

        } catch (error) {
            reset({ password: '' });

            if (error instanceof AxiosError) {
                console.error("Error de login:", error.response?.data);
                setErrorMessage(
                    error.response?.data?.error ||
                    error.message ||
                    "Credenciales incorrectas. Por favor, inténtalo de nuevo."
                );
            } else if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Ocurrió un error inesperado");
            }
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