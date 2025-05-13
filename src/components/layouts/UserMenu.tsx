import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { CircleUserRound, LogOut, LogIn } from 'lucide-react';
import ButtonIcon from '../ui/ButtonIcon';

const UserMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const authToken = Cookies.get('access_token');
            const name = Cookies.get('user_name');

            setIsAuthenticated(!!authToken);
            if (name) setUserName(name);
        };

        checkAuth();

        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        const cookieOptions = {
            path: '/',
        };

        ['access_token', 'user_role', 'user_name'].forEach(cookie => {
            Cookies.remove(cookie, cookieOptions);
        });

        setIsAuthenticated(false);
        setUserName('');
        setIsOpen(false);
        navigate('/login');
    };

    // Renderizado condicional CORREGIDO
    if (!isAuthenticated) {
        return (
            <ButtonIcon
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-white font-bold hover:text-gray-200 transition-colors"
            >
                <LogIn size={20} />
                <span>Ingresar</span>
            </ButtonIcon>
        );
    }

    return (
        <div className="relative">
            <ButtonIcon
                onClick={toggleMenu}
                className="flex items-center gap-2 cursor-pointer hover:bg-opacity-80 transition-colors"
                aria-label="Menú de usuario"
            >
                <CircleUserRound size={20} />
                <span className="capitalize text-sm md:text-base">
                    {userName?.split(' ').slice(0, 2).join(' ')}
                </span>
            </ButtonIcon>

            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50 overflow-hidden">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                    >
                        <LogOut size={18} className="text-red-500" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;