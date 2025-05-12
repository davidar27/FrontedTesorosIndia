import * as yup from "yup";

export const registerSchema = yup.object().shape({
    name: yup.string().required("El nombre es requerido").max(50, "El nombre debe tener máximo 50 caracteres"),
    email: yup.string().email("Correo electrónico inválido").required("El correo es obligatorio"),
    phone_number: yup.string().required("El teléfono es requerido").matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
    password: yup.string()
        .required("La contraseña es requerida")
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(32, "Máximo 32 caracteres")
        .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Solo se permiten caracteres especiales válidos"),
    confirm_password: yup.string()
        .required("Confirma tu contraseña")
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});