import ButtonIcon from "@/components/ui/buttons/ButtonIcon";
import { CircleUserRound } from "lucide-react";
import MenuButton from "./MenuButton";
import { User, LogOut } from "lucide-react"


const DesktopUserSection = ({
    user,
    textColor,
    isOpen,
    onToggle,
    onProfile,
    onLogout
}: {
    user: { name?: string } | null;
    textColor?: string;
    isOpen: boolean;
    onToggle: () => void;
    onProfile: () => void;
    onLogout: () => void;
}) => (
    <div className="hidden md:flex relative">
        <ButtonIcon
            onClick={onToggle}
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
                <MenuButton icon={<User size={18} className="text-blue-500" />} label="Perfil" onClick={onProfile} />
                <MenuButton icon={<LogOut size={18} className="text-red-500" />} label="Cerrar sesión" onClick={onLogout} />
            </div>
        )}
    </div>
);

export default DesktopUserSection;