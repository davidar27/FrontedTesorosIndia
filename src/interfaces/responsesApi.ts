import { User } from "@/interfaces/user";

export interface AuthResponse {
  user?: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  token_version?: number;
  error?: {
    type: "email" | "password" | "general" | "authentication";
    message: string;
    redirectTo?: string;
  };
  success?: boolean;
}

export interface TokenVerificationResponse {
  success: boolean;
  user: {
    data: {
      userId: number;
      name: string;
      role: string;
    };
    jti: string;
    token_version: number;
    iat: number;
    exp: number;
  };
  code: string;
}

export class AuthError extends Error {
  redirectTo?: string;
  errorType: "email" | "password" | "general" | "authentication";

  constructor(
    message: string,
    options?: {
      redirectTo?: string;
      errorType?: "email" | "password" | "general" | "authentication";
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

export interface SendPasswordResetEmailResponse {
  message: string;
  success: boolean;
}

