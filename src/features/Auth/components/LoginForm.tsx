import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <div>
        <label htmlFor="email" className="font-semibold block mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className="border-2 border-green-500 rounded-md p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="font-semibold block mb-1">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          className="border-2 border-green-500 rounded-md p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="bg-green-600 text-white font-semibold py-2 rounded-md">
        Inicia sesión
      </button>

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
