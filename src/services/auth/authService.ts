import { axiosInstance, setAccessToken } from "@/api/axiosInstance";
import { AuthResponse, TokenVerificationResponse, AuthError } from "@/interfaces/responsesApi";
import { User } from "@/interfaces/user";
import { Credentials } from "@/interfaces/formInterface";
import { UserRole } from "@/interfaces/role";

const authService = {
  login: async (credentials: Credentials): Promise<User> => {
    try {
      console.log('[AuthService] Iniciando login...');
      const { data } = await axiosInstance.post<AuthResponse>("/auth/iniciar-sesion", credentials);

      if (data.error) {
        console.error('[AuthService] Error en login:', data.error);
        throw new AuthError(data.error.message, {
          redirectTo: data.error.redirectTo,
          errorType: data.error.type,
        });
      }

      if (!data.user) {
        console.error('[AuthService] No se recibió usuario en respuesta');
        throw new AuthError("Error desconocido al iniciar sesión", {
          errorType: "general",
        });
      }

      // Almacenar el access token en memoria
      if (data.access_token) {
        console.log('[AuthService] Token recibido y almacenado');
        setAccessToken(data.access_token);
      } else {
        console.warn('[AuthService] No se recibió access token en login');
      }

      return data.user;
    } catch (error: unknown) {
      console.error('[AuthService] Error inesperado en login:', error);
      if (error instanceof AuthError) throw error;
      throw new AuthError("Error inesperado al iniciar sesión", {
        errorType: "general",
      });
    }
  },

  logout: async (): Promise<void> => {
    try {
      console.log('[AuthService] Iniciando logout...');
      await axiosInstance.post("/auth/cerrar-sesion");
      setAccessToken(null);
      console.log('[AuthService] Logout exitoso');
    } catch (error) {
      console.error('[AuthService] Error en logout:', error);
      throw new AuthError("Error al cerrar sesión", { errorType: "general" });
    }
  },

  verifyToken: async (): Promise<{ isValid: boolean; user?: User }> => {
    try {
      console.log('[AuthService] Verificando token...');
      const { data } = await axiosInstance.get<TokenVerificationResponse>("/auth/token/verificar");

      if (!data.success || data.code !== "VALITED_TOKEN") {
        console.warn('[AuthService] Token inválido o expirado');
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

      console.log('[AuthService] Token válido, usuario:', user);
      return { isValid: true, user };
    } catch (error) {
      console.error('[AuthService] Error en verificación de token:', error);
      setAccessToken(null);
      if (error instanceof AuthError && error.shouldRedirect()) {
        return { isValid: false };
      }
      return { isValid: false };
    }
  },

  refresh_token: async (): Promise<User> => {
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
      if (data.access_token) {
        console.log('[AuthService] Nuevo access token recibido y almacenado');
        setAccessToken(data.access_token);
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
