import { axiosInstance } from "@/api/axiosInstance";
import { AuthError } from '@/interfaces/responsesApi';

interface RegisterResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone_number?: string;
    };
    token?: string;
}

const registerService = async (
    name: string,
    email: string,
    phone_number: string,
    password: string,
    confirm_password: string
): Promise<RegisterResponse> => {
    try {
        const response = await axiosInstance.post("/usuario/registro", {
            name,
            email,
            phone_number,
            password,
            confirm_password,
        });
        if (response.status === '201' || response.status === '200') {
            return {
                success: true,
                message: response.data.message || "Registro exitoso",
                user: response.data.user,
                token: response.data.token
            };
        }

        throw new Error("Respuesta inesperada del servidor");

    } catch (error: unknown) {
        if (error instanceof AuthError) {
            throw error;
        }

        throw new AuthError("Error de conexión. Por favor, intenta nuevamente.", {
            errorType: 'general'
        });
    }
};

export default registerService;