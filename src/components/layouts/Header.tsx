import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import Picture from "@/components/ui/Picture";
import Navbar from "@/components/layouts/nav/Navbar";
import imgLogo from "@/assets/icons/logotesorosindia.webp";
import background from "/images/FondoMobile.webp";
import SearchBar from "../ui/SearchBar";
import HeaderActions from "./HeaderActions";

const excludedPaths = ["/login", "/registro"];

// Animaciones predefinidas (reutilizables)
const headerAnimations = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  scrolled: {
    height: "70px",
    transition: { type: "spring", damping: 20, stiffness: 300 }
  },
  unscrolled: {
    height: "90px",
    transition: { type: "spring", damping: 20, stiffness: 300 }
  }
};

const backgroundAnimations = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5, transition: { duration: 0.8 } }
};

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const isAboutUs = pathname === "/nosotros";
  const shouldRender = !excludedPaths.includes(pathname);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  if (!shouldRender) return null;

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerAnimations}
      className="fixed z-50 w-full text-white backdrop-blur-xs bg-black/30"
    >
      <AnimatePresence>
        {(!isHome || isAboutUs) && (
          <motion.div
            key="header-bg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backgroundAnimations}
            className="absolute inset-0 bg-cover brightness-50"
            style={{
              backgroundImage: `url(${background})`,
              backgroundPosition: "20% 19.2%",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`relative flex items-center justify-between gap-1 responsive-padding-x shadow-lg`}
        animate={scrolled ? "scrolled" : "unscrolled"}
        variants={headerAnimations}
      >
        {/* Logo con animación sutil */}
        <motion.div
          className="w-22 md:block md:w-30 lg:w-40 xl:w-50"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link to="/">
            <Picture
              src={imgLogo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </Link>
        </motion.div>

        {/* Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Search bar con animación interactiva */}
        <SearchBar />

        <div className="md:hidden mt-2">
          <Navbar />
        </div>

        {/* Botones con microinteracciones */}
        <HeaderActions />
      </motion.div>
    </motion.header>
  );
};

export default Header;