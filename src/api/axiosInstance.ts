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

// Almacenamiento en memoria del access token
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.access_token) {
      console.log('[Auth] Nuevo access token recibido');
      setAccessToken(response.data.access_token);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const errorData = error.response?.data;
    
    // Si es un error 401 y es un intento de login, manejar como error de credenciales
    if (Number(error.response?.status) === 401 && originalRequest.url?.includes('/auth/iniciar-sesion')) {
      console.log('[Auth] Error de credenciales en login');
      return Promise.reject(
        new AuthError("El correo o la contraseña son incorrectos", {
          errorType: "general"
        })
      );
    }
    
    // Si es un error 401 y no es un intento de refresh token, intentamos refrescar
    if (Number(error.response?.status) === 401 && !originalRequest.url?.includes('/auth/token/refrescar')) {
      console.log('[Auth] Token expirado, intentando refresh');
      
      if (originalRequest._retry) {
        console.log('[Auth] Ya se intentó refresh, sesión expirada');
        isRefreshing = false;
        refreshSubscribers = [];
        setAccessToken(null);
        return Promise.reject(
          new AuthError("Sesión expirada", {
            redirectTo: "/auth/iniciar-sesion",
            errorType: "authentication",
          })
        );
      }

      if (!isRefreshing) {
        console.log('[Auth] Iniciando proceso de refresh');
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          await authService.refreshToken();
          console.log('[Auth] Refresh exitoso, reintentando petición original');
          isRefreshing = false;
          onRefreshed();
          
          return axiosInstance(originalRequest);
        } catch (error) {
          console.error('[Auth] Error en refresh:', error);
          isRefreshing = false;
          refreshSubscribers = [];
          setAccessToken(null);
          return Promise.reject(
            new AuthError("Sesión expirada", {
              redirectTo: "/auth/iniciar-sesion",
              errorType: "authentication",
            })
          );
        }
      } else {
        console.log('[Auth] Refresh en proceso, agregando a cola de espera');
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
