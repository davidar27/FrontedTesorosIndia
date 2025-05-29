import axios from "axios";
import { AuthError } from "@/interfaces/responsesApi";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

function normalizeErrorType(type?: string): "email" | "password" | "general" {
  return type === "email" || type === "password" ? type : "general";
}

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
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Handle different response structures
    if (errorData) {
      let Message: string;
      let errorType: "email" | "password" | "general" = "general";

      // Check if errorData has the structure { error: { message: "...", type: "..." } }
      if (errorData.error && typeof errorData.error === 'object' && errorData.error.message) {
        Message = errorData.error.message;
        errorType = normalizeErrorType(errorData.error.type);
      }
      // Check if errorData has the structure { error: "message string" }
      else if (errorData.error && typeof errorData.error === 'string') {
        Message = errorData.error;

        // Determine error type based on status code and message content
        if (status === 409 || Message.toLowerCase().includes('correo') || Message.toLowerCase().includes('email')) {
          errorType = "email";
        } else if (Message.toLowerCase().includes('contraseña') || Message.toLowerCase().includes('password')) {
          errorType = "password";
        }
      }
      // Check if errorData has message directly
      else if (errorData.message) {
        Message = errorData.message;
        errorType = normalizeErrorType(errorData.type);
      }
      // Fallback
      else {
        Message = "Ha ocurrido un error";
      }

      const authError = new AuthError(
        Message || "Contraseña o correo incorrecto",
        {
          redirectTo: errorData.redirectTo,
          errorType: errorType,
        }
      );

      return Promise.reject(authError);
    }

    if (status === 401) {
      return Promise.reject(
        new AuthError("Sesión expirada o no autorizada", {
          redirectTo: "/login",
          errorType: "general",
        })
      );
    }

    // Handle network errors or other issues
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