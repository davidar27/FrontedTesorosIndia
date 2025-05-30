import { useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import getNavLinks from "./Links";
import { useAuth } from "@/context/useAuth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const links = getNavLinks(user);

  return (
    <nav className='container mx-auto flex justify-between items-center'>
        {/* Desktop */}
        <DesktopNav links={links} />

        {/* Mobile */}
        <MobileNav
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
          links={links}
        />
    </nav>
  );
};

export default Navbar;