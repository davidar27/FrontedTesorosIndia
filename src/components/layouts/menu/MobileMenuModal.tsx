import MenuButton from "./MenuButton";
import { User, LogOut } from "lucide-react"

const MobileMenuModal = ({
    isOpen,
    onClose,
    onProfile,
    onLogout
}: {
    isOpen: boolean;
    onClose: () => void;
    onProfile: () => void;
    onLogout: () => void;
}) => (
    isOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-90 md:hidden">
            <div className="w-full bg-white rounded-t-lg p-4 shadow-lg">
                <div className="flex flex-col gap-3">
                    <MenuButton icon={<User size={18} className="text-blue-500" />} label="Perfil" onClick={onProfile} mobile />
                    <MenuButton icon={<LogOut size={18} />} label="Cerrar sesión" onClick={onLogout} mobile className="text-red-600" />
                    <button onClick={onClose} className="text-sm text-gray-500 text-center mt-2 hover:underline">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
);

export default MobileMenuModal