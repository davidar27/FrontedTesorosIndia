import { User } from "@/interfaces/user";

export interface AuthResponse {
  user?: User;
  token?: string;
  error?: {
    type: "email" | "password" | "general";
    message: string;
    redirectTo?: string;
  };
  success?: boolean;
}

export class AuthError extends Error {
  redirectTo?: string;
  errorType: "email" | "password" | "general";

  constructor(
    message: string,
    options?: {
      redirectTo?: string;
      errorType?: "email" | "password" | "general";
    }
  ) {
    super(message);
    this.name = "AuthError";
    this.redirectTo = options?.redirectTo;
    this.errorType = options?.errorType || "general";
  }

  shouldRedirect(): boolean {
    return !!this.redirectTo;
  }
}

export interface ApiError {
  message: string;
  type?: string;
  code?: number;
  redirectTo?: string;
}
