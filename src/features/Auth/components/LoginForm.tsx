import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import { login } from "@/features/Auth/services/authService";
import Button from "@/components/ui/Button";
import { Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC = () => {

  const styles = {
    input: "border-2 border-green-500 rounded-md p-2 w-full",
    label: "font-semibold block mb-1 text-left"
  }
  const { input, label} = styles;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Definimos navigate aquí

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const data = await login(email, password);
          
          // Suponiendo que el token JWT contiene el  en el payload
          const token = data.token; 
          const role = data.role; // Este es el rol recibido del backend
  
          // Guardamos el token y el rol en las cookies
          Cookies.set("auth_token", token, { expires: 7 }); // El token expira en 7 días
          Cookies.set("user_role", role, { expires: 7 }); // Guardamos el rol
  
          console.log('Usuario autenticado:', data);
  
          // Redirigir al Home
          navigate("/"); // Redirige al Home después de login exitoso
  
      } catch (error: unknown) {
          if (error instanceof Error) {
              console.error('Error:', error.message);
              console.log('API URL:', import.meta.env.VITE_API_URL);
          } else {
              console.error('Unexpected error:', error);
          }
      }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="relative w-full">
        <label htmlFor="password" className={label}>Contraseña</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ingresa tu contraseña"
          className={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 bottom-1/5 text-gray-500 "
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button
        type="submit"
        className="bg-green-600 text-white font-semibold py-2 rounded-md"
      >
        Inicia sesión
      </Button>

      <div className="text-center text-sm mt-2">
        <a href="#" className="text-black underline">¿Has olvidado la contraseña?</a>
      </div>
      <div className="text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a href="#" className="text-black font-bold underline">Regístrate</a>
      </div>
    </form>
  );
};

export default LoginForm;
