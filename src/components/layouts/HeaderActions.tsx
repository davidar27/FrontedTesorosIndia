import { useState, useCallback } from "react";
import Button from "@/components/ui/buttons/Button";
import { ShoppingCart, Edit, Eye, Settings, Cloud, CloudOff } from "lucide-react";
import UserMenu from "@/components/layouts/menu/UserMenu";
import { motion } from "framer-motion";
import SidebarExperiences from "@/features/home/SidebarExperience";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useExperiencePermissions from "@/hooks/useExperiencePermissions";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useExperienceData } from "@/features/experience/hooks/useExperienceData";
import { useEditMode } from "@/features/experience/hooks/useEditMode";

interface HeaderActionsProps {
    isEditMode?: boolean;
    onToggleEditMode?: () => void;
}

const HeaderActions = ({ isEditMode = false, onToggleEditMode }: HeaderActionsProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const permissions = useExperiencePermissions();
    const isExperiencePage = location.pathname.includes('/experiencias/') || location.pathname.includes('/experiencia/');
    const { experience_id } = useParams();
    const { experience, products, members } = useExperienceData(Number(experience_id));
    const canEditExperience = permissions.canEdit && isExperiencePage;
    const { user } = useAuth();
    const isOwner = user?.role === 'emprendedor';
    const { items } = useCart();
    const navigate = useNavigate();
    const { handleChangeStatus, editData } = useEditMode(experience, products, members);
    const handleClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);



    return (
        <>
            <motion.div
                className="flex items-center justify-end gap-0.5 md:gap-2 lg:gap-4 xl:gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                {/* Botones de edición/vista - solo para emprendedores en su experiencia */}


                {canEditExperience && (


                    <div className="flex items-center gap-3">
                        {/* Botón principal de edición/vista */}


                        <div
                            className={`text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${editData?.status === 'publicada' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                            <span className="text-xs">
                                {editData?.status === 'publicada' ? (
                                    <Cloud className="w-4 h-4" />
                                ) : (
                                    <CloudOff className="w-4 h-4" />
                                )}
                            </span>
                            {editData?.status === 'publicada' ? 'Publicada' : 'Borrador'}

                        </div>

                        {isEditMode ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={onToggleEditMode}
                                    variant="primary"
                                >
                                    <Eye className="w-4 h-4" />
                                    Ver Vista
                                </Button>
                            </div>
                        ) : (
                            permissions.canEdit && (
                                <Button
                                    onClick={onToggleEditMode}
                                    variant="secondary"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar Experiencia
                                </Button>
                            )
                        )}

                        {/* Menú de opciones adicionales - solo visible en modo edición */}
                        {isEditMode && (
                            <div className="relative group">
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Opciones
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        {permissions.canDelete && (
                                            <button
                                                className={`w-full flex items-center gap-3 px-4 py-2 cursor-pointer scale-105
                                                    transition-all duration-300 text-sm ${editData?.status === 'publicada' ? 'text-red-500' : 'text-green-500'}`}
                                                onClick={handleChangeStatus}
                                            >

                                                {editData?.status === 'publicada' ? (
                                                    <CloudOff className="w-4 h-4" />
                                                ) : (
                                                    <Cloud className="w-4 h-4" />
                                                )}

                                                <span>{editData?.status === 'publicada' ? 'Desactivar Experiencia' : 'Activar Experiencia'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
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

            {/* Integramos la barra lateral que se abrirá al hacer clic en el botón */}
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