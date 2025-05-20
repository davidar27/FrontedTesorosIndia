import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import useClickOutside from "@/hooks/useClickOutside";
import LoginButton from "./LoginButton";
import MobileMenuModal from "./MobileMenuModal";
import DesktopUserSection from "./DesktopUserSection";
import MobileUserSection from "./MobileUserSection";

interface UserMenuProps {
  textColor?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ textColor = "text-white" }) => {
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
    return <LoginButton textColor={textColor} />;
  }

  return (
    <div className="relative flex items-center gap-2 w-full justify-between md:justify-start" ref={menuRef}>
      <MobileUserSection
        user={user}
        textColor={textColor}
        onProfile={() => handleAction(() => navigate("/perfil"))}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
      />

      <DesktopUserSection
        user={user}
        textColor={textColor}
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