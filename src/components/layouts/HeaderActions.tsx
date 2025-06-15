import { useState } from "react";
import ButtonIcon from "@/components/ui/buttons/ButtonIcon";
import Button from "@/components/ui/buttons/Button";
import { ShoppingCart } from "lucide-react";
import UserMenu from "@/components/layouts/menu/UserMenu";
import { motion } from "framer-motion";
import SidebarExperiences from "@/features/home/SidebarExperience";

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
                    <span>Experiencias</span>
                </Button>
                <div className="hidden md:block">
                    <UserMenu />
                </div>
            </motion.div>

            {/* Integramos la barra lateral que se abrirá al hacer clic en el botón */}
            <SidebarExperiences
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
        </>
    );
};

export default HeaderActions;