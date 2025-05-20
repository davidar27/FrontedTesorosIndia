import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut, LogIn, User, CircleEllipsis } from "lucide-react";
import ButtonIcon from "../ui/ButtonIcon";
import { useAuth } from "@/context/useAuth";

interface UserMenuProps {
  textColor?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ textColor = "text-white" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const goToProfile = () => {
    setIsOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/perfil");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated) {
    return (
      <ButtonIcon
        onClick={() => navigate("/login")}
        className="font-bold"
        textColor={textColor}
      >
        <LogIn size={20} />
        <span>Ingresar</span>
      </ButtonIcon>
    );
  }

  return (
    <>
      <div className="relative flex items-center gap-2 w-full justify-between md:justify-start" ref={menuRef}>
        {/* Mobile */}
        <div className="w-full flex md:hidden items-center gap-2 justify-between">
          <span
            onClick={goToProfile}
            className={`capitalize text-sm flex gap-2 items-center ${textColor}`}
          >
            <CircleUserRound size={20} />
            {user?.name?.split(" ").slice(0, 2).join(" ")}
          </span>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className=" text-gray-800 font-bold hover:underline flex gap-0.5 items-center"
          >
            <CircleEllipsis size={20} />
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex relative">
          <ButtonIcon
            onClick={toggleMenu}
            className="flex items-center gap-2 cursor-pointer hover:bg-opacity-80 transition-colors"
            aria-label="Menú de usuario"
            textColor={textColor}
          >
            <CircleUserRound size={20} />
            <span className="capitalize text-sm md:text-base">
              {user?.name?.split(" ").slice(0, 2).join(" ")}
            </span>
          </ButtonIcon>

          {isOpen && (
            <div className="absolute right-0 mt-10 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50 overflow-hidden">
              <button
                onClick={goToProfile}
                className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <User size={18} className="text-blue-500" />
                <span>Perfil</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <LogOut size={18} className="text-red-500" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black opacity-90 md:hidden">
          <div className="w-full bg-white rounded-t-lg p-4 shadow-lg">
            <div className="flex flex-col gap-3">
              <button
                onClick={goToProfile}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-800 text-base"
              >
                <User size={18} className="text-blue-500" />
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-red-600 text-base"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-gray-500 text-center mt-2 hover:underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
