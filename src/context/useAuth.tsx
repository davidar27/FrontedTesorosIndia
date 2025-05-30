import { AuthContext } from '@/context/AuthContext'
import { useContext } from "react";
import { AuthContextType } from '@/interfaces/authContextInterface';

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;