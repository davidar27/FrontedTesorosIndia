import AuthForm from '@/components/layouts/AuthForm';
import Cookies from "js-cookie";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { authService } from "@/features/Auth/services/authService";


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const data = await authService(email, password);

            Cookies.set("auth_token", data.token, { expires: 7 });
            Cookies.set("user_role", data.role, { expires: 7 });
            Cookies.set("user_name", data.name, { expires: 7 });

            navigate("/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
    };


    const fields = [
        { label: "Email", placeholder: "User@gmail.com", type: "email", name: "email", value: email },
        { label: "Contraseña", placeholder: "Ingresa tu contraseña", type: "password", name: "password", value: password },
    ];



    return (
        <AuthForm
            title="Iniciar sesión"
            subtitle="Inicia sesión con tu cuenta de"
            bold='Tesoros de la India'
            fields={fields}
            submitText="Ingresar"
            extraLinkText="¿Has olvidado la contraseña?"
            extraLinkTo="/recuperar"
            bottomText="¿No tienes cuenta?"
            bottomLinkText="Regístrate"
            bottomLinkTo="/registro"
            errorMessage={errorMessage}
            onSubmit={handleLogin}
            onChange={handleChange}

        />
    );
};

export default LoginPage;
