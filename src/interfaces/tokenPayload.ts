import { UserRole } from "./role";

export interface TokenPayload {
    userId: string;
    role?: UserRole;
    purpose?: 'email_verification' | 'password_reset';
}