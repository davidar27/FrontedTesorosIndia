import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "@/components/layouts/menu/UserMenu";
import Button from "@/components/ui/buttons/Button";

const navLinks = [
  { path: "/", label: "Inicio" },
  { path: "/nosotros", label: "Nosotros" },
  { path: "/productos", label: "Productos" }
];

const menuAnimation = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, y: -20 }
};

const linkAnimation = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <motion.div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <motion.div
            key={link.path}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={link.path}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile */}
      <div className="md:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuAnimation}
              className="absolute top-full left-0 w-full bg-white !text-gray-700 shadow-md z-40 px-4 py-3 md:hidden"
            >
              <motion.nav className="flex flex-col gap-3">
                <div className="border-b">
                  <UserMenu textColor="text-black" />
                </div>

                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    variants={linkAnimation}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-primary block py-2"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={linkAnimation}>
                  <Button className="text-black">
                    <span>Fincas</span>
                  </Button>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;