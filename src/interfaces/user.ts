import { UserRole } from "./role";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone_number?: string;

    // Campos condicionales por rol
    address?: string;        // Para clientes
}
