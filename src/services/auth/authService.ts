import { axiosInstance } from "@/api/axiosInstance";
import { AuthResponse } from "@/interfaces/responsesApi";
import { User } from "@/interfaces/user";
import { AuthError } from "@/interfaces/responsesApi";
import { Credentials } from "@/interfaces/formInterface";

const authService = {
  login: async (credentials: Credentials): Promise<User> => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>("/auth/login", credentials);

      if (data.error) {
        throw new AuthError(data.error.message, {
          redirectTo: data.error.redirectTo,
          errorType: data.error.type,
        });
      }

      if (!data.user) {
        throw new AuthError("Error desconocido al iniciar sesión", {
          errorType: "general",
        });
      }

      return data.user;
    } catch (error: unknown) {
      if (error instanceof AuthError) throw error;
      throw new AuthError("Error inesperado al iniciar sesión", {
        errorType: "general",
      });
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      throw new AuthError("Error al cerrar sesión", { errorType: "general" });
    }
  },

  verifyToken: async (): Promise<{ isValid: boolean; user?: User }> => {
    try {
      const { data } = await axiosInstance.get<AuthResponse>("/auth/verificar-token");
      console.log(data.success);


      if (data.error) return { isValid: false };

      return { isValid: true, user: data.user };
    } catch (error) {
      if (error instanceof AuthError && error.shouldRedirect()) {
        return { isValid: false };
      }
      return { isValid: false };
    }
  },

  refreshToken: async (): Promise<User> => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>("/refrescar-token");

      if (data.error) {
        throw new AuthError(data.error.message, {
          errorType: data.error.type,
        });
      }

      if (!data.user) {
        throw new AuthError("No se recibió el usuario", {
          errorType: "general",
        });
      }

      return data.user;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError("La sesión ha expirado", { errorType: "general" });
    }
  },
};

export default authService;
