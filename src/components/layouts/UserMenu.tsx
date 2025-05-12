import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import ButtonIcon from '../ui/ButtonIcon';
import { LogOut, LogIn } from 'lucide-react';

const UserMenu: React.FC = () => {


    const [isOpen, setIsOpen] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const isAuthenticated = Boolean(Cookies.get('auth_token'));

    useEffect(() => {
        const role = Cookies.get('user_role');
        const name = Cookies.get('user_name');
        if (role) setUserRole(role);
        if (name) setUserName(name);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        Cookies.remove('auth_token');
        Cookies.remove('user_role');
        Cookies.remove('user_name');
        setIsOpen(false);
        navigate('/login');
    };

    if (!isAuthenticated) {
        return (
            <ButtonIcon onClick={() => navigate('/login')} className="flex items-center gap-2 text-white font-bold ">
                <LogIn />
                <span>Ingresar</span>
            </ButtonIcon>
        );
    }

    return (
        <div className="relative">
            <ButtonIcon onClick={toggleMenu} className="flex items-center gap-2 cursor-pointer">
                <CircleUserRound />
                <span className="capitalize 2xl:text-xl md:text-md sm:text-sm">
                    {(userName || userRole)?.split(' ').slice(0, 2).join(' ')}
                </span>
            </ButtonIcon>

            {isOpen && (
                <div className="absolute right-0 mt-3 bg-white border rounded shadow-md w-40 z-10">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                        <LogOut />
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
