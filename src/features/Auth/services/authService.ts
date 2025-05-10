import axiosInstance from "@/api/axiosInstance";

export const authService = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post("/auth/login", {
            email,
            password,
        });

        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "Credenciales incorrectas");
        } else {
            throw new Error("Error de conexión con el servidor");
        }
    }
};
