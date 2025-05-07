import { Link } from 'react-router-dom'
import imgLogo from "../../assets/icons/logotesorosindia.webp";
import Navbar from "./Navbar";
const Header = () => {



    return (
        <header className="bg-transparent shadow-md fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link className="w-40" to="/"><img className="w-full" src={imgLogo} alt="" /></Link>
                    <Navbar />
                </div>
            </div>
        </header>
    );
};

export default Header;