import { MapPin, Package, Tag, User } from "lucide-react";
import { SidebarItem } from "@/types";

export const defaultSidebarItems: SidebarItem[] = [
    {
        id: 'emprendedores',
        label: 'Emprendedores',
        icon: User,
        path: '/dashboard/emprendedores',
        active: false
    },
    {
        id: 'experiencias',
        label: 'Experiencias',
        icon: MapPin,
        path: '/dashboard/experiencias',
        active: false
    },
    {
        id: 'paquetes',
        label: 'Paquetes',
        icon: Package,
        path: '/dashboard/paquetes',
        active: false
    },
    {
        id: 'categorias',
        label: 'Categorías',
        icon: Tag,
        path: '/dashboard/categorias',
        active: false
    }
]; 