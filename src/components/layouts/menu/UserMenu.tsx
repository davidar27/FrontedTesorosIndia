import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import useClickOutside from "@/hooks/useClickOutside";
import MobileMenuModal from "./MobileMenuModal";
import DesktopUserSection from "./DesktopUserSection";
import MobileUserSection from "./MobileUserSection";
import LoginButton from "@/components/ui/buttons/LoginButton";



const UserMenu: React.FC = () => {
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
    <div className="relative flex items-center gap-2 w-full justify-between md:justify-start" ref={menuRef}>
      <MobileUserSection
        user={user}
        onProfile={() => handleAction(() => navigate("/perfil"))}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
      />

      <DesktopUserSection
        user={user}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onProfile={() => handleAction(() => navigate("/perfil"))}
        onLogout={() => handleAction(logout)}
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