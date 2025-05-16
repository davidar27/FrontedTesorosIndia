//componentes
import Button from "@/components/ui/Button";
import Picture from "@/components/ui/Picture";
import UserMenu from "@/components/layouts/UserMenu";
import ButtonIcon from "@/components/ui/ButtonIcon";
import Navbar from "@/components/layouts/Navbar";

//assets
import imgLogo from "@/assets/icons/logotesorosindia.webp";
import { Search, ShoppingCart } from "lucide-react";
import background from "@/assets/images/Paisaje1.webp";
//hooks
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const location = useLocation();
  const ocultarDiv = ["/login", "/registro", "/form"].includes(
    location.pathname
  );
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (ocultarDiv) return null;

  return (
    <header className="fixed z-50 w-full text-white  ">
      {!isHome && (
        <div
          className="absolute inset-0 bg-cover brightness-50"
          style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: "20% 19.2%",
          }}
        ></div>
      )}
      <div
        className={`relative flex  items-center justify-between gap-1 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 transition-all duration-300 ease-in-out shadow-lg  ${scrolled ? "shadow-xl h-10 md:h-16 lg:h-22" : "h-16 md:h-20 lg:h-26"
          }`}
      >
        {/* Logo */}
        <div className="w-22 md:block md:w-30 lg:w-40 xl:w-50">
          <Link to="/">
            <Picture
              src={imgLogo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </Link>
        </div>

        {/* <div className="w-15 md:hidden">
          <Link to="/">
            <Picture
              src={logoSmall}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </Link>
        </div> */}

        {/* Mobile: Navbar and search hidden initially */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        {/* Search bar */}
        <div className="relative w-40 sm:w-45 md:w-80 lg:w-100  ">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 py-0.5 md:py-1.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="md:hidden mt-2">
          <Navbar />
        </div>
        {/* Actions */}
        <div className="flex items-center justify-end gap-0.5 md:gap-2 lg:gap-4 xl:gap-6">
          <ButtonIcon>
            <ShoppingCart />
          </ButtonIcon>

          <Button className="hidden md:block">
            <span>Fincas</span>
          </Button>
          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
