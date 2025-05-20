import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import UserMenu from "../menu/UserMenu";

const MobileNav = ({
    isOpen,
    toggleMenu,
    closeMenu,
    links
}: {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
    links: Array<{ path: string; label: string }>;
}) => {
    const location = useLocation();

    return (
        <div className="md:hidden">
            {/* Botón de hamburguesa */}
            <button
                onClick={toggleMenu}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Menú desplegable */}
            <motion.div
                className="fixed inset-0 z-50 bg-white h-fit"
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex justify-end">
                        <button
                            onClick={closeMenu}
                            className="p-2 text-gray-500 hover:text-primary"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-8 flex-grow">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;

                            return (

                                <motion.div
                                    key={link.path}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative"
                                >
                                    <UserMenu textColor="text-black" />

                                    <NavLink
                                        to={link.path}
                                        label={link.label}
                                        onClick={closeMenu}
                                        className={`text-xl font-medium ${isActive ? "text-primary" : "text-gray-800"
                                            } hover:text-primary transition-colors`}
                                    />

                                    {isActive && (
                                        <motion.div
                                            layoutId="mobileIndicator"
                                            className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-t-md"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}

                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MobileNav;