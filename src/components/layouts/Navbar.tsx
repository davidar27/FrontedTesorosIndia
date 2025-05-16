import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

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
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white text-gray-700 shadow-md z-40 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3">
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
            <div className="pt-3 border-t">
              <UserMenu /> {/* Mobile user menu */}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
