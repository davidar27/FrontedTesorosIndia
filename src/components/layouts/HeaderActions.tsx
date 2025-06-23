import { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import { ShoppingCart, Edit, Eye, Settings } from "lucide-react";
import { Users } from "lucide-react";
import { Package } from "lucide-react";
import UserMenu from "@/components/layouts/menu/UserMenu";
import { motion } from "framer-motion";
import SidebarExperiences from "@/features/home/SidebarExperience";
import { Link, useLocation, useParams } from "react-router-dom";
import useExperiencePermissions from "@/hooks/useExperiencePermissions";
import { useAuth } from "@/context/AuthContext";
import CartSidebar from "@/components/ui/display/CartSidebar";
import { useCart } from "@/context/CartContext";

interface HeaderActionsProps {
    isEditMode?: boolean;
    onToggleEditMode?: () => void;
}

const HeaderActions = ({ isEditMode = false, onToggleEditMode }: HeaderActionsProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const location = useLocation();
    const permissions = useExperiencePermissions();
    const { experience_id } = useParams();
    const isExperiencePage = location.pathname.includes('/experiencias/') || location.pathname.includes('/experiencia/');
    const canEditExperience = permissions.canEdit && isExperiencePage;
    const { user } = useAuth();
    const isOwner = user?.role === "emprendedor";
    const { items } = useCart();

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
                                        {permissions.canManageMembers && (
                                            <Link
                                                to={`/experiencias/${experience_id}/integrantes`}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Users className="w-4 h-4" />
                                                <span>Gestionar Integrantes</span>
                                            </Link>
                                        )}

                                        {permissions.canManageProducts && (
                                            <Link
                                                to={`/experiencias/${experience_id}/productos`}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Package className="w-4 h-4" />
                                                <span>Gestionar Productos</span>
                                            </Link>
                                        )}

                                        {permissions.isAdmin && (
                                            <Link
                                                to={`/dashboard/experiencias/${experience_id}/configuracion`}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Configuración Avanzada</span>
                                            </Link>
                                        )}

                                        {permissions.canDelete && (
                                            <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                                                <Settings className="w-4 h-4" />
                                                <span>Eliminar Experiencia</span>
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
                        <div className="relative">
                            <button
                                aria-label="Abrir carrito"
                                className="p-2 rounded hover:bg-gray-100 focus:outline-none"
                                onClick={() => setCartOpen(true)}
                                tabIndex={0}
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {items.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </button>
                        </div>
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
                    onClose={() => setSidebarOpen(false)}
                />
            )}
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
};

export default HeaderActions;