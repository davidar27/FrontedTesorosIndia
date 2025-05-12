//componentes
import Button from '@/components/ui/Button';
import Picture from '@/components/ui/Picture';
import UserMenu from '@/components/layouts/UserMenu';
import ButtonIcon from '@/components/ui/ButtonIcon';
import Navbar from '@/components/layouts/Navbar';

//assets
import imgLogo from '@/assets/icons/logotesorosindia.webp';
import { Search, ShoppingCart } from 'lucide-react';
//hooks
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';






const Header: React.FC = () => {
    const location = useLocation();
    const ocultarDiv = ['/login', '/registro', '/form'].includes(location.pathname);

    if (ocultarDiv) return null;

    return (
        <header className="bg-green-900/50 shadow-md fixed top-0 w-full z-50 text-white flex items-center justify-between p-4 sm:px-2 md:px-5 lg:px-10 xl:px-12 sm:gap-2 md:gap-4 lg:gap-6 xl:gap-8">
            <div className="w-40">
                <Link to="/">
                    <Picture src={imgLogo} alt="Logo" className="w-full h-full object-cover" />
                </Link>
            </div>

            <Navbar />

            <div className="relative w-120 max-w-md mx-auto ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <ButtonIcon>
                <span>
                    <ShoppingCart />
                </span>
            </ButtonIcon>

            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                <span>Fincas</span>
            </Button>

            <UserMenu />

        </header>
    );
};

export default Header;
