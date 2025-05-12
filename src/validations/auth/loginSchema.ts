import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria')
});
