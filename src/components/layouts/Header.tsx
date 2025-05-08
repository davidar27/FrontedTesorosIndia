import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Search, ShoppingCart, CircleUserRound } from 'lucide-react';

import imgLogo from '@/assets/icons/logotesorosindia.webp';
import Navbar from './Navbar';
import Button from '@/components/ui/Button';
import ButtonIcon from '@/components/ui/ButtonIcon';
import Picture from '@/components/ui/Picture';

const Header: React.FC = () => {
    const location = useLocation();
    const ocultarDiv = ['/login', '/register'].includes(location.pathname);

    if (ocultarDiv) return null;

    return (
        <header className="bg-transparent shadow-md fixed top-0 w-full z-50 text-white flex items-center justify-around p-4 md:px-10 lg:px-20 xl:px-40 2xl:px-60 gap-4">
            <div className="w-40">
                <Link to="/">
                    <Picture src={imgLogo} alt="Logo" className="w-full h-full object-cover" />
                </Link>
            </div>

            <Navbar />

            <div className="relative w-50 max-w-md mx-auto ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <Button>
                <span>
                    <ShoppingCart />
                </span>
            </Button>

            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                <span>Fincas</span>
            </Button>

            <ButtonIcon className="" label="Ingresar" url="/login" target="_self">
                <span>
                    <CircleUserRound />
                </span>
            </ButtonIcon>
        </header>
    );
};

export default Header;
