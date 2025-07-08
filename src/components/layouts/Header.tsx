import { motion, AnimatePresence, useScroll, useMotionValueEvent, Variants } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import Picture from "@/components/ui/display/Picture";
import Navbar from "@/components/layouts/nav/Navbar";
import imgLogo from "@/assets/icons/logotesorosindia.webp";
import background from "/images/FondoMobile.webp";
import SearchBar from "../../features/home/searchBar/SearchBar";
import HeaderActions from "./HeaderActions";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onStatusChangeRequest?: () => void;
  currentStatus?: string;
}

const excludedPaths = ["/auth/iniciar-sesion", "/auth/registro"];

const headerAnimations = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  scrolled: {
    height: "70px",
    transition: { duration: 0.2, ease: "easeOut" }
  },
  unscrolled: {
    height: "90px",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const backgroundAnimations = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5, transition: { duration: 0.5 } }
};

const Header: React.FC<HeaderProps> = ({ isEditMode = false, onToggleEditMode, onStatusChangeRequest, currentStatus }) => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isHome = pathname === "/";
  const isAboutUs = pathname === "/nosotros";
  const shouldRender = !excludedPaths.includes(pathname);
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const isOwner = user?.role === "emprendedor";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const handleSearchToggle = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
  };

  if (!shouldRender) return null;

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerAnimations as Variants}
      className="fixed z-50 w-full text-white backdrop-blur-sm bg-black/30"
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
        className={`relative flex items-center justify-between responsive-padding-x shadow-lg`}
        animate={scrolled ? "scrolled" : "unscrolled"}
        variants={headerAnimations as Variants}
      >
        {/* Logo */}
        <AnimatePresence>
          {!isSearchExpanded && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-22 md:w-30 lg:w-40 xl:w-50"
            >
              <Link to="/">
                <Picture
                  src={imgLogo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navbar */}
        <AnimatePresence>
          {!isSearchExpanded && (
            <motion.div
              key="navbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block"
            >
              <Navbar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search bar */}
        {!isOwner && (

          <motion.div
            layout
            transition={{ duration: 0.3 }}
            className={`${isSearchExpanded ? 'absolute inset-x-0 mx-4 md:relative md:mx-0' : 'relative'}`}
          >
            <SearchBar
              onToggle={handleSearchToggle}
              expanded={isSearchExpanded}
            />
          </motion.div>
        )}
        {/* Navbar mobile */}
        <AnimatePresence>
          {!isSearchExpanded && (
            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2"
            >
              <Navbar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header actions */}
        <AnimatePresence>
          {!isSearchExpanded && (
            <motion.div
              key="header-actions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <HeaderActions
                isEditMode={isEditMode}
                onToggleEditMode={onToggleEditMode}
                onStatusChangeRequest={onStatusChangeRequest}
                currentStatus={currentStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};

export default Header;