import { useState, useCallback } from "react";
import Button from "@/components/ui/buttons/Button";
import { ShoppingCart, Edit, Eye, MoreVertical, Cloud, CloudOff, Save } from "lucide-react";
import UserMenu from "@/components/layouts/menu/UserMenu";
import { motion } from "framer-motion";
import SidebarExperiences from "@/features/home/SidebarExperience";
import { useLocation, useNavigate } from "react-router-dom";
import useExperiencePermissions from "@/hooks/useExperiencePermissions";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface HeaderActionsProps {
    isEditMode?: boolean;
    onToggleEditMode?: () => void;
    onStatusChangeRequest?: () => void;
    onSaveChanges?: () => Promise<boolean>;
    isSaving?: boolean;
    currentStatus?: string;
}

const HeaderActions = ({
    isEditMode = false,
    onToggleEditMode,
    onStatusChangeRequest,
    onSaveChanges,
    isSaving = false,
    currentStatus
}: HeaderActionsProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const permissions = useExperiencePermissions();
    const isExperiencePage = location.pathname.includes('/experiencias/') || location.pathname.includes('/experiencia/');
    const canEditExperience = permissions.canEdit && isExperiencePage;
    const { user } = useAuth();
    const isOwner = user?.role === 'emprendedor';
    const { items } = useCart();
    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const isPublished = currentStatus === 'publicada';

    // Dropdown menu para opciones secundarias
    const handleDropdownToggle = () => setDropdownOpen((open) => !open);
    const handleDropdownClose = () => setDropdownOpen(false);

    return (
        <>
            <motion.div
                className="flex items-center justify-end gap-2 md:gap-3 lg:gap-4 xl:gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Acciones de experiencia solo para emprendedores */}
                {canEditExperience && (
                    <div className="flex items-center gap-2">
                        {/* Badge de estado */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isPublished ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                            title={isPublished ? 'Experiencia publicada' : 'Experiencia en borrador'}>
                            {isPublished ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
                            {isPublished ? 'Publicada' : 'Borrador'}
                        </span>
                        {/* Guardar Cambios */}
                        {isEditMode && onSaveChanges && (
                            <Button
                                onClick={onSaveChanges}
                                variant="primary"
                                loading={isSaving}
                                messageLoading="Guardando..."
                                className="px-3 py-2 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                Guardar Cambios
                            </Button>
                        )}
                        {/* Ver Vista */}
                        {isEditMode && (
                            <Button
                                onClick={onToggleEditMode}
                                className="px-3 py-2 text-sm !bg-transparent !border-none"
                            >
                                <Eye className="w-4 h-4" />
                                Ver Vista
                            </Button>
                        )}
                        {/* Editar Experiencia (cuando no está en modo edición) */}
                        {!isEditMode && permissions.canEdit && (
                            <Button
                                onClick={onToggleEditMode}
                                variant="secondary"
                                className="px-3 py-2 text-sm"
                            >
                                <Edit className="w-4 h-4" />
                                Editar Experiencia
                            </Button>
                        )}
                        {/* Menú de opciones secundarias */}
                        {isEditMode && (
                            <div className="relative">
                                <button
                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                    onClick={handleDropdownToggle}
                                    aria-label="Más opciones"
                                    type="button"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 top-12 min-w-[180px] bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                                        onMouseLeave={handleDropdownClose}
                                    >
                                        <button
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${isPublished ? 'text-red-500' : 'text-green-500'} transition-colors group cursor-pointer`}
                                            onClick={() => {
                                                handleDropdownClose();
                                                onStatusChangeRequest?.();
                                            }}
                                        >
                                            {isPublished ? <CloudOff className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                                            {isPublished ? 'Desactivar Experiencia' : 'Activar Experiencia'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Acciones normales del header */}
                {!isOwner && (
                    <>
                        {user?.role !== 'administrador' && (
                            <div className="relative">
                                <button
                                    aria-label="Abrir carrito"
                                    onClick={() => navigate("/carrito")}
                                    className="p-2 cursor-pointer transition-all duration-300 focus:outline-none"
                                    type="button"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    {items.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {items.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                        <Button
                            className="hidden md:block"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span>Experiencias</span>
                        </Button>
                    </>
                )}
                <div className="hidden md:block">
                    <UserMenu />
                </div>
            </motion.div>

            {/* Sidebar de experiencias */}
            {!isOwner && (
                <SidebarExperiences
                    isOpen={sidebarOpen}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default HeaderActions;