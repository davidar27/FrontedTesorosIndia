import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import Button from "../ui/Button";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <Link to="/nosotros" className="hover:text-primary transition-colors">
          Nosotros
        </Link>
        <Link to="/productos" className="hover:text-primary transition-colors">
          Productos
        </Link>
      </div>

      {/* Mobile menu toggle button */}
      <div className="md:hidden p-0 m-0">
        <button onClick={toggleMenu}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white !text-gray-700 shadow-md z-40 px-4 py-3 md:hidden">

          <nav className="flex flex-col gap-3">
            <div className="border-b">
              <UserMenu textColor="text-black"/>
              
            </div>
            <Link to="/" onClick={closeMenu} className="hover:text-primary">
              Inicio
            </Link>
            <Link
              to="/nosotros"
              onClick={closeMenu}
              className="hover:text-primary"
            >
              Nosotros
            </Link>
            <Link
              to="/productos"
              onClick={closeMenu}
              className="hover:text-primary"
            >
              Productos
            </Link>

            <Button className="hidden md:block text-black">
              <span>Fincas</span>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
