import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import useClickOutside from "@/hooks/useClickOutside";
import MobileMenuModal from "./MobileMenuModal";
import DesktopUserSection from "./DesktopUserSection";
import MobileUserSection from "./MobileUserSection";
import LoginButton from "@/components/ui/buttons/LoginButton";



const UserMenu: React.FC<{ textColor?: string }> = ({ textColor }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return <LoginButton/>;
  }

  return (
    <div className={`"relative flex items-center gap-2 justify-between md:justify-start  text-${textColor ? textColor : 'black'} `} ref={menuRef}>
      <MobileUserSection
        user={user}
        onProfile={() => handleAction(() => navigate("/perfil"))}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        textColor={textColor}
      />

      <DesktopUserSection
        user={user}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onProfile={() => handleAction(() => navigate("/perfil"))}
        onLogout={() => handleAction(logout)}
        textColor={textColor}
      />

      <MobileMenuModal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onProfile={() => handleAction(() => navigate("/perfil"))}
        onLogout={() => handleAction(logout)}
      />
    </div>
  );
};







export default UserMenu;