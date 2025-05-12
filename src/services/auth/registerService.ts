import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

interface RegisterResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone_number: string;
    };
    token?: string;
}

interface RegisterError {
    error: string;
    details?: Record<string, string>;
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

        if (response.status === 201) {
            return {
                success: true,
                message: response.data.message || "Registro exitoso",
                user: response.data.user,
                token: response.data.token
            };
        }

        throw new Error("Respuesta inesperada del servidor");

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const serverError = error.response?.data as RegisterError;
            throw new Error(serverError?.error || "Error en el registro");
        }
        throw new Error("Error desconocido al procesar la solicitud");
    }
};

export default registerService;