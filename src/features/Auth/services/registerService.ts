import axiosInstance from "@/api/axiosInstance";

const registerService = async (
    name: string,
    email: string,
    phone_number: string,
    password: string,
    confirmPassword: string
) => {
    try {
        const response = await axiosInstance.post("/usuario/registro", {
            name,
            email,
            phone_number,
            password,
            confirmPassword,
            role: "cliente"
        });
        console.log(name, email, phone_number, password, confirmPassword);

        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "Error del servidor");
        } else {
            throw new Error("Error al conectarse con el servidor");
        }
    }
};

export default registerService;