import { useState } from "react";
import ButtonIcon from "../ui/buttons/ButtonIcon";
import Button from "../ui/buttons/Button";
import { ShoppingCart } from "lucide-react";
import UserMenu from "./menu/UserMenu";
import { motion } from "framer-motion";
import SidebarEstates from "./SidebarEstates";

const HeaderActions = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <motion.div
                className="flex items-center justify-end gap-0.5 md:gap-2 lg:gap-4 xl:gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <ButtonIcon>
                    <ShoppingCart />
                </ButtonIcon>
                <Button
                    className="hidden md:block"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span>Fincas</span>
                </Button>
                <div className="hidden md:block">
                    <UserMenu />
                </div>
            </motion.div>

            {/* Integramos la barra lateral que se abrirá al hacer clic en el botón */}
            <SidebarEstates
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </>
    );
};

export default HeaderActions;