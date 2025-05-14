import { AuthContext } from '@/context/AuthContext'
import { useContext } from "react";

export const useAuth = () => {
    const context = useContext(AuthContext);
    console.log(context);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};