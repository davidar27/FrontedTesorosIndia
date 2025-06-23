import { UserRole } from "./role";

export interface TokenPayload {
    userid: string;
    role?: UserRole;
    purpose?: 'email_verification' | 'password_reset';
}