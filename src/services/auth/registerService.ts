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

        // Respuestas exitosas (200-299)
        if (Number(response.status) >= 200 && Number(response.status) < 300) {
            return {
                success: true,
                message: response.data.message || "Registro exitoso",
                user: response.data.user,
                token: response.data.token
            };
        }

        // Esto normalmente no se ejecutaría porque Axios maneja los códigos de error
        throw new Error(`Respuesta inesperada del servidor: ${response.status}`);

    } catch (error: unknown) {
        if (error instanceof AuthError) {
            throw error;
        }

        throw new AuthError("Error desconocido durante el registro", {
            errorType: 'general'
        });
    }
};


export default registerService;