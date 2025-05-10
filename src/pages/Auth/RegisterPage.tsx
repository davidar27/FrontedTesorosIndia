import AuthForm from '@/components/layouts/AuthForm';
import registerService from '@/features/Auth/services/registerService';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await registerService(name, email, phone_number, password, confirmPassword);
            navigate("/login");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(name, email, phone_number, password, confirmPassword);

            if (error.response) {
                console.error("Detalles del error:", {
                    status: error.response.status,
                    data: error.response.data,
                });
                
                throw new Error(error.response.data.error || "Error de validación");
            } else {
                throw new Error("Error de conexión con el servidor");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "name") setName(value);
        if (name === "email") setEmail(value);
        if (name === "phone_number") setPhoneNumber(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    const fields = [
        { label: "Nombre", placeholder: "Ingresa tu nombre", name: "name" },
        { label: "Email", placeholder: "User@gmail.com", type: "email", name: "email" },
        { label: "Número Celular", placeholder: "3123446735", name: "phone_number" },
        { label: "Contraseña", placeholder: "Ingresa tu contraseña", type: "password", name: "password" },
        { label: "Confirmar contraseña", placeholder: "Ingresa tu contraseña", type: "password", name: "confirmPassword" },
    ];

    return (
        <AuthForm
            title="Registro"
            subtitle="Regístrate ingresando los siguientes datos"
            fields={fields}
            submitText="Crear cuenta"
            bottomText="¿Ya tienes cuenta?"
            bottomLinkText="Inicia sesión"
            bottomLinkTo="/login"
            errorMessage={errorMessage}
            onSubmit={handleRegister}
            onChange={handleChange}
        />
    );
};

export default RegisterPage;
