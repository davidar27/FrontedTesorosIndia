import { useEffect, useState,useRef } from "react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { motion } from "framer-motion"


const DesktopNav = ({ links }: { links: Array<{ path: string; label: string }> }) => {
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navRef = useRef<HTMLDivElement>(null);

    const updateIndicator = () => {
        if (!navRef.current) return;

        const activeLink = navRef.current.querySelector('[data-active="true"]') as HTMLAnchorElement;

        if (activeLink) {
            const navRect = navRef.current.getBoundingClientRect();
            const activeRect = activeLink.getBoundingClientRect();

            setIndicatorStyle({
                left: activeRect.left - navRect.left,
                width: activeRect.width,
                opacity: 1
            });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }
    };

    useEffect(() => {
        updateIndicator();
        const timeoutId = setTimeout(updateIndicator, 50);
        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    useEffect(() => {
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, []);

    return (
        <motion.div
            className="hidden md:flex items-center gap-6 relative"
            ref={navRef}
        >
            {links.map((link) => (
                <motion.div
                    key={link.path}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <NavLink to={link.path} label={link.label} />
                </motion.div>
            ))}

            {/* Indicador deslizante con framer-motion */}
            <motion.div
                className="absolute top-6 h-1 bg-primary rounded-t-md"
                initial={{ opacity: 0 }}
                animate={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        </motion.div>
    );
};

export default DesktopNav;