import { axiosInstance } from "@/api/axiosInstance";
import { AuthResponse } from "@/interfaces/responsesApi";
import { User } from "@/interfaces/user";
import { AuthError } from "@/interfaces/responsesApi";

const authService = {
  async login(credentials: { email: string; password: string }): Promise<User> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      if (response.data.error) {
        throw new AuthError(response.data.error.message, {
          redirectTo: response.data.error.redirectTo,
          errorType: response.data.error.type,
        });
      }

      if (!response.data.user) {
        throw new AuthError("Error desconocido al iniciar sesión", {
          errorType: "general",
        });
      }
      return response.data.user;
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("Error inesperado al iniciar sesión", {
        errorType: "general",
      });
    }
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("authToken");
    } catch  {
      throw new AuthError("Error al cerrar sesión", { errorType: "general" });
    }
  },

  async verifyToken(): Promise<{ isValid: boolean; user?: User }> {
    try {
      const res = await axiosInstance.get<AuthResponse>(
        "/auth/verificar-token"
      );

      if (res.data.error) {
        return { isValid: false };
      }

      return { isValid: true, user: res.data.user };
    } catch (error) {
      if (error instanceof AuthError && error.shouldRedirect()) {
        return { isValid: false };
      }
      return { isValid: false };
    }
  },

  async refreshToken(): Promise<User> {
    try {
      const res = await axiosInstance.post<AuthResponse>("/auth/refresh");

      if (res.data.error) {
        throw new AuthError(res.data.error.message, {
          errorType: res.data.error.type,
        });
      }

      if (!res.data.user) {
        throw new AuthError("No se recibió el usuario", {
          errorType: "general",
        });
      }
      return res.data.user;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("La sesión ha expirado", { errorType: "general" });
    }
  },
};

export default authService;
