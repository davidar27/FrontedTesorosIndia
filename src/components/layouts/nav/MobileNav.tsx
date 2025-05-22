import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import UserMenu from "../menu/UserMenu";

interface MobileNavProps {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
    links: Array<{ path: string; label: string }>;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, toggleMenu, closeMenu, links }) => {
    const location = useLocation();

    return (
        <div className="md:hidden">
            {/* Botón de hamburguesa */}
            <button onClick={toggleMenu}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Menú desplegable */}
            <motion.div
                className="fixed inset-y-auto inset-0 z-50 bg-white h-fit overflow-y-auto"
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
                <div className="relative flex flex-col h-full p-6">

                    {/* Componente UserMenu */}
                    <UserMenu />


                    {/* Sección de navegación */}
                    <div className="mb-8 mt-8">
                        <div className="flex flex-col space-y-2">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <motion.div
                                        key={link.path}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative"
                                    >
                                        <NavLink
                                            to={link.path}
                                            label={link.label}
                                            onClick={closeMenu}
                                            className={`block py-3 px-4 rounded-lg ${isActive ? "bg-gray-100 text-primary" : "text-gray-800 hover:bg-gray-50"}`}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MobileNav;