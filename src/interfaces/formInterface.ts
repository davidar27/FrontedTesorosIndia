import { UserRole } from "@/interfaces/role";

export interface Credentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegistrationData extends Credentials {
  name: string;
  confirm_password: string;
  phone: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirm_password: string;
}
