import { Link } from 'react-router-dom'
import imgLogo from "../../assets/icons/logotesorosindia.webp";
import Navbar from "./Navbar";
import SearchBar from "../ui/Searchbar";
import ButtonIcon from "../ui/ButtonIcon";
import { ShoppingCart } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import Button from '../ui/Button';
const Header = () => {



    return (
        <header className="bg-transparent shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link className="w-40" to="/"><img className="w-full" src={imgLogo} alt="" /></Link>
                    <Navbar />
                    <SearchBar />

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
                    >
                        <span className="">
                            <CircleUserRound />                        </span>
                    </ButtonIcon>

                </div>
            </div>
        </header>
    );
};

export default Header;