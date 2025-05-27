import { UserRole } from "@/interfaces/role";
import { User } from "@/interfaces/user";
import { Credentials } from "./formInterface";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    role: UserRole | null;
    isAdmin: boolean;
    isEntrepreneur: boolean;
    isClient: boolean;
    login: (credentials: Credentials) => Promise<User>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
    checkAuth: () => Promise<void>;
    refreshAuth: (silent?: boolean) => Promise<boolean>;
    setError: (error: string | null) => void;
    isPublicRoute: (path: string) => boolean;
}