import { UserRole } from "./role";

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    token?: string;
    isVerified?: boolean;
    image?: string;

    // Campos condicionales por rol
    address?: string;    // Para cliente
    addressNumber?: string;
    addressZipCode?: number;
    experience_id?: number //emprendedores
}
