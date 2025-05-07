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
        <header className="bg-transparent shadow-md fixed top-0 w-full z-50 text-white flex items-center justify-around p-4 md:px-10 lg:px-20 xl:px-40 2xl:px-60 gap-4">
            <div className="w-40">
                <Link to="/"><img className="w-full" src={imgLogo} alt="" /></Link>
            </div>
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


        </header>
    );
};

export default Header;