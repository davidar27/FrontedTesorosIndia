//components
import AuthForm from '@/components/layouts/AuthForm';
//hooks
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
//services
import registerService from '@/services/auth/registerService';
//validations
import { registerSchema } from "@/validations/auth/registerSchema";
import { z } from 'zod';
//interfaces
import { AuthError } from '@/interfaces/responsesApi';
import { useFieldValidation, passwordRules, emailRules, phoneRules } from '@/hooks/useFieldValidation';

type RegistrationData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const [Message, setMessage] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showValidations, setShowValidations] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        clearErrors,
        setError: setFormError,
        watch
    } = useForm<RegistrationData>({
        resolver: zodResolver(registerSchema),
    });

    const watchedFields = {
        password: watch('password') || '',
        email: watch('email') || '',
        phone: watch('phone') || ''
    };

    const validations = {
        password: useFieldValidation(watchedFields.password, passwordRules),
        email: useFieldValidation(watchedFields.email, emailRules),
        phone: useFieldValidation(watchedFields.phone, phoneRules)
    };

    useEffect(() => {
        if (location.state?.prefilledEmail) {
            setValue('email', location.state.prefilledEmail);
        }
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location.state, setValue]);

    const onSubmit = async (data: RegistrationData) => {
        try {
            setIsRedirecting(false);
            setMessage('');
            clearErrors();

            const result = await registerService(
                data.name,
                data.email,
                data.phone,
                data.password,
                data.confirm_password
            );

            if (result.success) {
                setIsRedirecting(true);
                setTimeout(() => {
                    navigate('/auth/verificacion', {
                        state: {
                            registrationSuccess: true,
                            email: result.user?.email || data.email
                        }
                    });
                }, 1000);
            } else {
                setMessage(result.message);
                setFormError('email', {
                    type: 'manual',
                    message: result.message
                });
            }
        } catch (error: unknown) {
            setIsRedirecting(false);

            if (error instanceof AuthError) {
                setMessage(error.message);
                const errorType = error.errorType;

                if (errorType === 'email') {
                    setFormError('email', {
                        type: 'manual',
                        message: error.message
                    });
                }
            } else {
                const errorMsg = "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
                setMessage(errorMsg);
                console.error('Registration error:', error);
            }
        }
    };

    const handleFormChange = () => {
        if (Message) {
            setMessage("");
        }
        if (isRedirecting) {
            setIsRedirecting(false);
        }
        if (Object.keys(errors).length > 0) {
            clearErrors();
        }
    };

    const handleFocus = (fieldName: string) => {
        setShowValidations(prev => ({ ...prev, [fieldName]: true }));
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
            placeholder: "correo@ejemplo.com",
            type: "email",
            name: "email",
            validationRules: validations.email.validations,
            showValidation: showValidations.email,
            onFocus: () => handleFocus('email')
        },
        {
            label: "Número Celular",
            placeholder: "3123446735",
            type: "tel",
            name: "phone",
            validationRules: validations.phone.validations,
            showValidation: showValidations.phone,
            onFocus: () => handleFocus('phone')
        },
        {
            label: "Contraseña",
            placeholder: "••••••••",
            type: "password",
            name: "password",
            validationRules: validations.password.validations,
            showValidation: showValidations.password,
            onFocus: () => handleFocus('password')
        },
        {
            label: "Confirmar contraseña",
            placeholder: "••••••••",
            type: "password",
            name: "confirm_password"
        },
    ];

    return (
        <AuthForm
            title="Crear cuenta"
            subtitle="Únete a Tesoros de la India"
            fields={fields}
            submitText="Registrarse"
            bottomText="¿Ya tienes una cuenta?"
            bottomLinkText="Inicia sesión aquí"
            bottomLinkTo="/auth/iniciar-sesion"
            Message={Message}
            errorType={errors.email ? "email" : "general"}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting || isRedirecting}
            onChange={handleFormChange}
        />
    );
};

export default RegisterPage;