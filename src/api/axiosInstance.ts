import axios from 'axios';
import { AuthError } from '@/interfaces/responsesApi';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const errorData = error.response?.data?.error;

        
        console.log("ERROR RECIBIDO EN INTERCEPTOR :   " + errorData );

        if (errorData) {
            return Promise.reject(new AuthError(errorData.message, {
                redirectTo: errorData.redirectTo,
                errorType: errorData.type || 'general'
            }));
        }
        console.log(errorData);

        return Promise.reject(error);
    }
);