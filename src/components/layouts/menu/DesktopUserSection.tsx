import ButtonIcon from "@/components/ui/buttons/ButtonIcon";
import MenuButton from "./MenuButton";
import { User, LogOut } from "lucide-react"
import Avatar from "@/components/ui/display/Avatar";
import { User as UserType } from "@/interfaces/user";

const DesktopUserSection = ({
    user,
    textColor,
    isOpen,
    onToggle,
    onProfile,
    onLogout
}: {
    user: UserType | null;
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
            <Avatar
                name={user?.name || ''}
                src={user?.image || null}
            />
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