import axiosInstance from "@/api/axiosInstance";
import axios, { AxiosError } from "axios";
import { AuthResponse, AuthError } from "@/types/auth/authTypes"

const authService = {
    /**
     * Inicia sesión con email y contraseña
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await axiosInstance.post<Omit<AuthResponse, 'token'>>("/auth/login", {
                email,
                password,
            });
            console.log(response);
            
            return {
                name: response.data.name,
                expiresIn: response.data.expiresIn || 3600,
            };

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422) {
                    const serverError = error.response?.data as AuthError;
                    throw new AxiosError(
                        serverError?.error || "Datos de entrada inválidos",
                        error.code,
                        error.config,
                        error.request,
                        error.response
                    );
                }

                const serverError = error.response?.data as AuthError;
                throw new AxiosError(
                    serverError?.error ||
                        error.response?.status === 401
                        ? "Credenciales inválidas"
                        : "Error en el servidor",
                    error.code,
                    error.config,
                    error.request,
                    error.response
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
    async verifyToken(token: string): Promise<{ isValid: boolean; user?: AuthResponse['name'] }> {
        try {
            const response = await axiosInstance.get("/auth/verificar-token", {
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