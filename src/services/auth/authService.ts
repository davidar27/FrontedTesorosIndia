import axiosInstance from "@/api/axiosInstance";
import axios from "axios";
import { AuthResponse, AuthError } from "@/types/auth/authTypes"

// Tipos para las respuestas


const authService = {
    /**
     * Inicia sesión con email y contraseña
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await axiosInstance.post<AuthResponse>("/auth/login", {
                email,
                password,
            });

            if (!response.data.token) {
                throw new Error("No se recibió token en la respuesta");
            }

            return {
                token: response.data.token,
                user: response.data.user,
                expiresIn: response.data.expiresIn || 3600, 
            };

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const serverError = error.response?.data as AuthError;
                throw new Error(
                    serverError?.error ||
                        error.response?.status === 401
                        ? "Credenciales inválidas"
                        : "Error en el servidor"
                );
            }
            throw new Error("Error desconocido al intentar iniciar sesión");
        }
    },

    /**
     * Cierra la sesión del usuario
     */
    async logout(): Promise<void> {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (error) {
            console.warn("Error al cerrar sesión", error);
        }
    },

    /**
     * Verifica si el token actual es válido
     */
    async verifyToken(token: string): Promise<{ isValid: boolean; user?: AuthResponse['user'] }> {
        try {
            const response = await axiosInstance.get("/auth/verify-token", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { isValid: true, user: response.data.user };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { isValid: false };
        }
    }
};

export default authService;