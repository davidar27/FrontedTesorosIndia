//components
import AuthForm from '@/components/layouts/AuthForm';
//hooks
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from 'react';
//services
import registerService from '@/services/auth/registerService';
//validations
import { registerSchema } from "@/validations/auth/registerSchema";
//types
import { RegisterFormData } from '@/types/auth/registerTypes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setErrorMessage('');

            const result = await registerService(
                data.name,
                data.email,
                data.phone_number,
                data.password,
                data.confirm_password
            );

            setTimeout(() => {
                navigate('/correo-enviado', {
                    state: {
                        registrationSuccess: true,
                        email: result.user?.email || data.email
                    }
                });
            }, 1000);

        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Ocurrió un error desconocido");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fields = [
        {
            label: "Nombre",
            placeholder: "Ingresa tu nombre",
            type: "text",
            name: "name"
        },
        {
            label: "Email",
            placeholder: "user@ejemplo.com",
            type: "email",
            name: "email"
        },
        {
            label: "Número Celular",
            placeholder: "3123446735",
            type: "tel",
            name: "phone_number"
        },
        {
            label: "Contraseña",
            placeholder: "Ingresa tu contraseña",
            type: "password",
            name: "password"
        },
        {
            label: "Confirmar contraseña",
            placeholder: "Confirma tu contraseña",
            type: "password",
            name: "confirm_password"
        },
    ];

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <AuthForm
                title="Registro"
                subtitle="Regístrate ingresando los siguientes datos"
                fields={fields}
                submitText="Crear cuenta"
                bottomText="¿Ya tienes cuenta?"
                bottomLinkText="Inicia sesión"
                bottomLinkTo="/login"
                errorMessage={errorMessage}
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                isSubmitting={isLoading}
                onChange={() => setErrorMessage("")}
            />
        </>
    );
};

export default RegisterPage;