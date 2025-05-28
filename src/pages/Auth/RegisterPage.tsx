//components
import AuthForm from '@/components/layouts/AuthForm';
//hooks
import { useNavigate, useLocation } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
//services
import registerService from '@/services/auth/registerService';
//validations
import { registerSchema } from "@/validations/auth/registerSchema";
//interfaces
import { RegistrationData } from '@/interfaces/formInterface';
import { AuthError } from '@/interfaces/responsesApi';

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        clearErrors,
        setError: setFormError
    } = useForm<RegistrationData>({
        resolver: yupResolver(registerSchema),
    });

    useEffect(() => {
        if (location.state?.prefilledEmail) {
            setValue('email', location.state.prefilledEmail);
        }
        if (location.state?.message) {
            setErrorMessage(location.state.message);
        }
    }, [location.state, setValue]);

    const onSubmit = async (data: RegistrationData) => {
        try {
            setIsRedirecting(false);
            setErrorMessage(''); 
            clearErrors();

            const result = await registerService(
                data.name,
                data.email,
                data.phone_number,
                data.password,
                data.confirm_password
            );


            if (result.success) {
                setIsRedirecting(true);

                setTimeout(() => {
                    navigate('/correo-enviado', {
                        state: {
                            registrationSuccess: true,
                            email: result.user?.email || data.email
                        }                        
                    });
                }, 1000);
            } else {
                setErrorMessage(result.message);
                setFormError('email', {
                    type: 'manual',
                    message: result.message
                });
            }

        } catch (error: unknown) {
            setIsRedirecting(false);

            if (error instanceof AuthError) {
                setErrorMessage(error.message);

                const errorType = error.errorType || error.errorType;

                if (errorType === 'email') {
                    setFormError('email', {
                        type: 'manual',
                        message: error.message
                    });
                } else if (errorType === 'general') {
                    // The errorMessage state will handle displaying the error
                }
            } else {
                const errorMsg = "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
                setErrorMessage(errorMsg);
                console.error('Registration error:', error);
            }

            
        }
    };

    const handleFormChange = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
        if (isRedirecting) {
            setIsRedirecting(false);
        }
        if (Object.keys(errors).length > 0) {
            clearErrors();
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

    // Determine error type for AuthForm
    const getErrorType = () => {
        if (errors.email) return "email";
        return "general";
    };

    return (
        <AuthForm
            title="Registro"
            subtitle="Regístrate ingresando los siguientes datos"
            fields={fields}
            submitText={
                isSubmitting ? "Procesando..." :
                    isRedirecting ? "Redirigiendo..." :
                        "Crear cuenta"
            }
            bottomText="¿Ya tienes cuenta?"
            bottomLinkText="Inicia sesión"
            bottomLinkTo="/login"
            errorMessage={errorMessage}
            errorType={getErrorType()}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting || isRedirecting}
            onChange={handleFormChange}
        />
    );
};

export default RegisterPage;