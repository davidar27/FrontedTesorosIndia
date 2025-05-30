import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AuthError } from "@/interfaces/responsesApi";
import authService from "@/services/auth/authService";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          await authService.refreshToken();
          isRefreshing = false;
          onRefreshed();
          
          return axiosInstance(originalRequest);
        } catch {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(
            new AuthError("Sesión expirada", {
              redirectTo: "/login",
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

    const status = error.response?.status;
    const errorData = error.response?.data;

    if (errorData) {
      let Message = "Ha ocurrido un error";
      let errorType: "email" | "password" | "general" | "authentication" = "general";

      if (typeof errorData === 'object' && errorData !== null) {
        if ('error' in errorData) {
          if (typeof errorData.error === 'object' && errorData.error !== null && 'message' in errorData.error) {
            Message = String(errorData.error.message);
            errorType = normalizeErrorType((errorData.error as {type?: string}).type);
          } else if (typeof errorData.error === 'string') {
            Message = errorData.error;

            if (status === 409 || Message.toLowerCase().includes('correo') || Message.toLowerCase().includes('email')) {
              errorType = "email";
            } else if (Message.toLowerCase().includes('contraseña') || Message.toLowerCase().includes('password')) {
              errorType = "password";
            }
          }
        } else if ('message' in errorData && errorData.message) {
          Message = String(errorData.message);
          if ('type' in errorData) {
            errorType = normalizeErrorType(errorData.type as string);
          }
        }

        const authError = new AuthError(Message || "Ha ocurrido un error",
          {
            redirectTo: 'redirectTo' in errorData ? String(errorData.redirectTo) : undefined,
            errorType: errorType,
          }
        );

        return Promise.reject(authError);
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
