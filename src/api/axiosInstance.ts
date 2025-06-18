import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AuthError } from "@/interfaces/responsesApi";
import authService from "@/services/auth/authService";

// Instancia autenticada con toda la configuración existente
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Instancia pública sin autenticación
export const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

function normalizeErrorType(type?: string): "email" | "password" | "general" | "authentication" {
  if (type === "email" || type === "password" || type === "authentication") {
    return type;
  }
  return "general";
}

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    // Si los datos son FormData, eliminar el Content-Type para que axios lo establezca automáticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Verificar si el token está próximo a expirar
    if (isTokenExpiringSoon() && !config.url?.includes('/auth/token/refrescar')) {
      try {
        await authService.refresh_token();
      } catch {
        // Continuamos con la petición aunque falle el refresh
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const errorData = error.response?.data;
    
    if (Number(error.response?.status) === 401 && originalRequest.url?.includes('/auth/iniciar-sesion')) {
      return Promise.reject(
        new AuthError("El correo o la contraseña son incorrectos", {
          errorType: "general"
        })
      );
    }
    
    if (Number(error.response?.status) === 401 && !originalRequest.url?.includes('/auth/token/refrescar')) {
      
      if (originalRequest._retry) {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(
          new AuthError("Sesión expirada", {
            redirectTo: "/auth/iniciar-sesion",
            errorType: "authentication",
          })
        );
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          await authService.refresh_token();
          isRefreshing = false;
          onRefreshed();
          
          return axiosInstance(originalRequest);
        } catch  {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(
            new AuthError("Sesión expirada", {
              redirectTo: "/auth/iniciar-sesion",
              errorType: "authentication",
            })
          );
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    if (errorData) {
      let Message = "Ha ocurrido un error";
      let errorType: "email" | "password" | "general" | "authentication" = "general";

      if (typeof errorData === 'object' && errorData !== null) {
        if ('error' in errorData) {
          if (typeof errorData.error === 'object' && errorData.error !== null && 'message' in errorData.error) {
            Message = String(errorData.error.message);
            errorType = normalizeErrorType((errorData.error as { type?: string }).type);
          } else if (typeof errorData.error === 'string') {
            Message = errorData.error;
          }
        } else if ('message' in errorData && errorData.message) {
          Message = String(errorData.message);
          if ('type' in errorData) {
            errorType = normalizeErrorType(errorData.type as string);
          }
        }

        return Promise.reject(
          new AuthError(Message, {
            redirectTo: 'redirectTo' in errorData ? String(errorData.redirectTo) : undefined,
            errorType: errorType,
          })
        );
      }
    }

    if (!error.response) {
      return Promise.reject(
        new AuthError("Error de conexión. Por favor, verifica tu conexión a internet.", {
          errorType: "general",
        })
      );
    }

    return Promise.reject(error);
  }
);

// Interceptor simple para la instancia pública
publicAxiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(
        new AuthError("Error de conexión. Por favor, verifica tu conexión a internet.", {
          errorType: "general",
        })
      );
    }
    return Promise.reject(error);
  }
);

// Función para verificar si el token está próximo a expirar
const isTokenExpiringSoon = (): boolean => {
  // Como el token está en las cookies, no podemos verificar su expiración directamente
  // El backend se encargará de manejar la expiración y renovación
  return false;
};
