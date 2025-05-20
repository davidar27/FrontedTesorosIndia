import { useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Links from "./Links";



const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Desktop */}
        <DesktopNav links={Links} />

        {/* Mobile */}
        <MobileNav
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
          links={Links}
        />
      </div>
    </nav>
  );
};

export default Navbar;