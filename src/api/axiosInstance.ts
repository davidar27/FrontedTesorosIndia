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

// Función helper para normalizar tipos de error
function normalizeErrorType(type?: string): "email" | "password" | "general" {
  return type === "email" || type === "password" ? type : "general";
}

axiosInstance.interceptors.response.use(
  (response) => {
    // Puedes transformar respuestas exitosas aquí si es necesario
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data?.error;

    // Silencia solo los 401 (pero registra otros errores)
    if (status !== 401 && process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }

    // Manejo de errores con estructura esperada
    if (errorData) {
      const authError = new AuthError(
        errorData.message || "Error de autenticación",
        {
          redirectTo: errorData.redirectTo,
          errorType: normalizeErrorType(errorData.type),
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

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Intenta renovar el access token
        await axios.post(
          `${process.env.VITE_API_URL}/refrescar-token`,
          {},
          { withCredentials: true }
        );

        // 2. Reintenta la petición original con el nuevo token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 3. Redirige a login si falla el refresh
        window.location.href = "/login?session_expired=1";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
