import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut, LogIn } from "lucide-react";
import ButtonIcon from "../ui/ButtonIcon";
import { useAuth } from "@/context/useAuth";
import DropdownMenu from "../ui/DropdownMenu";

interface UserMenuProps {
  textColor?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  textColor = "text-white"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/");
  };

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
    <div className="relative ">
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



      {isOpen &&

        <DropdownMenu>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <LogOut size={18} className="text-red-500" />
            <span>Cerrar sesión</span>
          </button>
        </DropdownMenu>
      }
    </div>
  );
};

export default UserMenu;
