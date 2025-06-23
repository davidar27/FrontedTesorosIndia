import { useCallback, useState, useMemo } from "react";

import { useLocation,useNavigate } from "react-router-dom";
import { SidebarItem } from "@/components/admin/SideBar";
import { User, MapPin, Package, Tag, Home, BarChart } from "lucide-react";


const useSidebarLogic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Obtener sección activa de la URL
    const getActiveSectionFromPath = useCallback((pathname: string): string => {
        const pathSegments = pathname.split('/');
        return pathSegments[pathSegments.length - 1] || 'emprendedores';
    }, []);

    const activeSection = getActiveSectionFromPath(location.pathname);

    // Sidebar items con estado activo
    const sidebarItems: SidebarItem[] = useMemo(() => [
        {
            id: 'home',
            label: 'Inicio',
            icon: Home,
            path: '/',
            active: activeSection === 'home'
        },
        {
            id: 'estadisticas',
            label: 'Estadisticas',
            icon: BarChart,
            path: '/dashboard',
            active: activeSection === 'estadisticas'
        },
        {
            id: 'emprendedores',
            label: 'Emprendedores',
            icon: User,
            path: '/dashboard/emprendedores',
            active: activeSection === 'emprendedores'
        },
        {
            id: 'experiencias',
            label: 'Experiencias',
            icon: MapPin,
            path: '/dashboard/experiencias',
            active: activeSection === 'experiencias'
        },
        {
            id: 'paquetes',
            label: 'Paquetes',
            icon: Package,
            path: '/dashboard/paquetes',
            active: activeSection === 'paquetes'
        },
        {
            id: 'categorias',
            label: 'Categorías',
            icon: Tag,
            path: '/dashboard/categorias',
            active: activeSection === 'categorias'
        }
    ], [activeSection]);

    // Handlers
    const handleSidebarItemClick = useCallback((sectionid: string) => {
        navigate(`/dashboard/${sectionId}`);
        setShowMobileMenu(false); // Cerrar menú móvil
    }, [navigate]);

    const handleMobileMenuToggle = useCallback(() => {
        setShowMobileMenu(prev => !prev);
    }, []);

    const handleMobileMenuClose = useCallback(() => {
        setShowMobileMenu(false);
    }, []);

    return {
        sidebarItems,
        showMobileMenu,
        handleSidebarItemClick,
        handleMobileMenuToggle,
        handleMobileMenuClose
    };
};

export default useSidebarLogic;
