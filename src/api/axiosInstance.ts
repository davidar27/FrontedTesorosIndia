import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Redirigir a login o manejar token expirado
//             window.location.href = '/login?sessionExpired=true';
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;