import { axiosInstance } from "@/api/axiosInstance";
import { AuthResponse, TokenVerificationResponse, LoginResponse, AuthError } from "@/interfaces/responsesApi";
import { User } from "@/interfaces/user";
import { Credentials } from "@/interfaces/formInterface";
import { UserRole } from "@/interfaces/role";

// Tipo para los datos de usuario que pueden venir en diferentes formatos
type UserDataInput = 
  | { userId: number; name: string; role: string; experience_id?: number; image?: string }
  | { data: { userId: number; name: string; role: string; experience_id?: number; image?: string } }
  | User;

// Función helper para normalizar los datos del usuario desde diferentes formatos de respuesta
const normalizeUserData = (userData: UserDataInput): User => {
  // Formato del login: { logged, status, userId, role, name, token_version, experience_id, image }
  if ('userId' in userData && userData.userId && 'name' in userData && userData.name && 'role' in userData && userData.role) {
    return {
      id: userData.userId.toString(),
      name: userData.name,
      role: userData.role as UserRole,
      email: '', // No disponible en la respuesta del login
      isVerified: true,
      experience_id: userData.experience_id,
      image: userData.image
    };
  }
  
  // Formato de verificación: { data: { userId, name, role, experience_id, image } }
  if ('data' in userData && userData.data && 'userId' in userData.data && userData.data.userId && 'name' in userData.data && userData.data.name && 'role' in userData.data && userData.data.role) {
    return {
      id: userData.data.userId.toString(),
      name: userData.data.name,
      role: userData.data.role as UserRole,
      email: '', // No disponible en la respuesta de verificación
      isVerified: true,
      experience_id: userData.data.experience_id,
      image: userData.data.image
    };
  }
  
  // Formato estándar de User
  if ('id' in userData && userData.id && 'name' in userData && userData.name && 'role' in userData && userData.role) {
    return {
      id: userData.id,
      name: userData.name,
      role: userData.role as UserRole,
      email: userData.email || '',
      isVerified: userData.isVerified || true,
      experience_id: userData.experience_id,
      image: userData.image
    };
  }
  
  throw new AuthError("Formato de datos de usuario no reconocido", {
    errorType: "general"
  });
};

const authService = {
  login: async (credentials: Credentials): Promise<User> => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/iniciar-sesion", credentials);


      if (!data.user) {
        throw new AuthError("Error desconocido al iniciar sesión", {
          errorType: "general",
        });
      }

      const normalizedUser = normalizeUserData(data.user);

      localStorage.setItem('lastTokenRefresh', Date.now().toString());

      return normalizedUser;
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
      localStorage.removeItem('lastTokenRefresh');
    } catch  {
      localStorage.removeItem('lastTokenRefresh');
      throw new AuthError("Error al cerrar sesión", { errorType: "general" });
    }
  },

  verifyToken: async (): Promise<{ isValid: boolean; user?: User }> => {
    try {
      const { data } = await axiosInstance.get<TokenVerificationResponse>("/auth/token/verificar");

      if (!data.success || data.code !== "VALITED_TOKEN") {
        return { isValid: false };
      }

      const normalizedUser = normalizeUserData(data.user);

      return { isValid: true, user: normalizedUser };
    } catch (error) {
      if (error instanceof AuthError && error.shouldRedirect()) {
        return { isValid: false };
      }
      return { isValid: false };
    }
  },

  refresh_token: async (): Promise<User> => {
    try {
      
      const { data } = await axiosInstance.post<AuthResponse>("/auth/token/refrescar", {}, {
        withCredentials: true
      });
      

      if (data.error) {
        console.error('❌ Refresh token error:', data.error);
        throw new AuthError(data.error.message, {
          errorType: data.error.type,
        });
      }

      if (!data.user) {
        console.error('❌ No user data in refresh response');
        throw new AuthError("No se recibió el usuario", {
          errorType: "general",
        });
      }

      const normalizedUser = normalizeUserData(data.user);

      localStorage.setItem('lastTokenRefresh', Date.now().toString());
      return normalizedUser;
    } catch (error: unknown) {
      console.error('❌ Refresh token failed:', error);
      
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response) {
        const response = error.response as { status: number };
        if (response.status === 404 || response.status === 501) {
          try {
            const verifyResult = await authService.verifyToken();
            if (verifyResult.isValid && verifyResult.user) {
              localStorage.setItem('lastTokenRefresh', Date.now().toString());
              return verifyResult.user;
            }
          } catch (verifyError) {
            console.error('❌ Token verification also failed:', verifyError);
          }
        }
      }
      
      if (error instanceof AuthError) throw error;
      throw new AuthError("La sesión ha expirado", { 
        errorType: "authentication",
        redirectTo: "/auth/iniciar-sesion"
      });
    }
  },
};

export default authService;
