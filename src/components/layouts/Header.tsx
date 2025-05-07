import { Link } from 'react-router-dom'
import imgLogo from "../../assets/icons/logotesorosindia.webp";
import Navbar from "./Navbar";
import { Search } from 'lucide-react';
import ButtonIcon from "../ui/ButtonIcon";
import { ShoppingCart } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import Button from '../ui/Button';
const Header: React.FC = () => {
    return (
        <header className="bg-transparent shadow-md fixed top-0 w-full z-50 text-white flex items-center justify-around p-4 md:px-10 lg:px-20 xl:px-40 2xl:px-60 gap-4">


            <div className="w-40">
                <Link to="/"><img className="w-full" src={imgLogo} alt="" /></Link>
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
                <span className="">
                    <ShoppingCart />
                </span>
            </Button>

            <Button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg'>
                <span className="">
                    Fincas
                </span>
            </Button>


            <ButtonIcon
                className=""
                label="Ingresar"
                url='/login'
                target='_self'  
            >
                <span className="">
                    <CircleUserRound />
                </span>
            </ButtonIcon>


        </header>
    );
};

export default Header;