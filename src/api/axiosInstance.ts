import axios from 'axios';
import { PUBLIC_ROUTES } from '@/routes/publicRoutes';
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthError = error.response?.status === 401;
        const isPublicRoute = PUBLIC_ROUTES.includes(window.location.pathname);

        if (isAuthError && !isPublicRoute) {
            // Solo redirige si no está en una ruta pública
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }

        return Promise.reject(error);
    }
);

