import { axiosInstance, setAccessToken } from "@/api/axiosInstance";
import { AuthResponse, TokenVerificationResponse, AuthError } from "@/interfaces/responsesApi";
import { User } from "@/interfaces/user";
import { Credentials } from "@/interfaces/formInterface";
import { UserRole } from "@/interfaces/role";

const authService = {
  login: async (credentials: Credentials): Promise<User> => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>("/auth/iniciar-sesion", credentials);

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

      // Almacenar el access token en memoria
      if (data.accessToken) {
        setAccessToken(data.accessToken);
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
      await axiosInstance.post("/auth/cerrar-sesion");
      setAccessToken(null);
    } catch {
      throw new AuthError("Error al cerrar sesión", { errorType: "general" });
    }
  },

  verifyToken: async (): Promise<{ isValid: boolean; user?: User }> => {
    try {
      const { data } = await axiosInstance.get<TokenVerificationResponse>("/auth/token/verificar");

      if (!data.success || data.code !== "VALITED_TOKEN") {
        setAccessToken(null);
        return { isValid: false };
      }

      const user: User = {
        id: data.user.data.userId.toString(),
        name: data.user.data.name,
        role: data.user.data.role as UserRole,
        email: '', 
        isVerified: true
      };

      return { isValid: true, user };
    } catch (error) {
      setAccessToken(null);
      if (error instanceof AuthError && error.shouldRedirect()) {
        return { isValid: false };
      }
      return { isValid: false };
    }
  },

  refreshToken: async (): Promise<User> => {
    try {
      console.log('[AuthService] Iniciando refresh token');
      const { data } = await axiosInstance.post<AuthResponse>("/auth/token/refrescar");

      if (data.error) {
        console.error('[AuthService] Error en refresh:', data.error);
        throw new AuthError(data.error.message, {
          errorType: data.error.type,
        });
      }

      if (!data.user) {
        console.error('[AuthService] No se recibió el usuario en refresh');
        throw new AuthError("No se recibió el usuario", {
          errorType: "general",
        });
      }

      // Almacenar el nuevo access token en memoria
      if (data.accessToken) {
        console.log('[AuthService] Nuevo access token recibido y almacenado');
        setAccessToken(data.accessToken);
      } else {
        console.warn('[AuthService] No se recibió nuevo access token en refresh');
      }

      return data.user;
    } catch (error) {
      console.error('[AuthService] Error en refresh token:', error);
      setAccessToken(null);
      if (error instanceof AuthError) throw error;
      throw new AuthError("La sesión ha expirado", { 
        errorType: "authentication",
        redirectTo: "/auth/iniciar-sesion"
      });
    }
  },
};

export default authService;
