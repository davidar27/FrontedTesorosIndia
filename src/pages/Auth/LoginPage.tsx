import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/layouts/AuthForm';
import { loginSchema } from '@/validations/auth/loginSchema';
import { emailRules, passwordRules } from '@/hooks/useFieldValidation';
import { AuthError } from '@/interfaces/responsesApi';
import { UserRole } from '@/interfaces/role';
import { useNotificationModal } from '@/hooks/useNotificationModal';

type LoginFormData = z.infer<typeof loginSchema>;

const getRedirectPath = (role: UserRole | undefined, from: string | undefined, experience_id: number | undefined): string => {
    if (from && from !== '/auth/iniciar-sesion') {
        return from;
    }
    
    switch (role) {
        case 'administrador':
            return '/dashboard';
        case 'emprendedor':
            if (experience_id) {
                return `/experiencias/${experience_id}`;
            }
            return '/';
        default:
            return '/';
    }
};

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();    
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [errorType, setErrorType] = useState<"email" | "password" | "general" | null>(null);
    const { user } = useAuth();
    const { showSuccess, showError } = useNotificationModal();


    useEffect(() => {
        if (user) {
            const from = location.state?.from;
            const redirectPath = getRedirectPath(user.role, from, user.experience_id);
            navigate(redirectPath, { replace: true });
        }
    }, [user, location.state?.from, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const user = await login(data);
            const from = location.state?.from;
            const redirectPath = getRedirectPath(user.role, from,user.experience_id);
            
            // Mostrar modal de éxito antes de redirigir
            showSuccess(
                'Sesión iniciada',
                `¡Bienvenido de vuelta, ${user.name}! Has iniciado sesión exitosamente.`,
                { autoCloseDelay: 2000 }
            );
            
            // Redirigir después de un breve delay para que se vea el modal
            setTimeout(() => {
                navigate(redirectPath, { replace: true });
            }, 1000);
        } catch (error) {
            if (error instanceof AuthError) {
                showError(
                    'Error al iniciar sesión',
                    error.message,
                    { autoClose: false }
                );
                if (error.errorType !== "authentication") {
                    setErrorType(error.errorType);
                } else {
                    setErrorType("general");
                }
            } else {
                showError(
                    'Error al iniciar sesión',
                    'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
                    { autoClose: false }
                );
                setErrorType("general");
            }
        }
    };

    const fields = [
        {
            name: "email",
            type: "email",
            label: "Correo electrónico",
            placeholder: "Ingresa tu correo electrónico",
            rules: emailRules,
        },
        {
            name: "password",
            type: "password",
            label: "Contraseña",
            placeholder: "Ingresa tu contraseña",
            rules: passwordRules,
        }
    ];

    return (
        <AuthForm
            title="Inicio de sesión"
            subtitle="Inicia  sesión con tu cuenta de Tesoros India"
            fields={fields}
            submitText="Iniciar Sesión"
            loadingText="Iniciando sesión..."
            bottomText="¿No tienes una cuenta?"
            bottomLinkText="Regístrate"
            bottomLinkTo="/auth/registro"
            extraLinkText="¿Olvidaste tu contraseña?"
            extraLinkTo="/auth/password/recuperar"
            Message={errorMessage}
            messageStyle={{
                textColor: "text-red-600",
                backgroundColor: "bg-red-100"
            }}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
                setErrorMessage(undefined);
                setErrorType(null);
            }}
            register={register}
            errors={errors}
            errorType={errorType}
        />
    );
};

export default LoginPage;