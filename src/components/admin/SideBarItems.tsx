import { MapPin, Package, Tag, User } from "lucide-react";
import { SidebarItem } from "./SideBar";

export const defaultSidebarItems: SidebarItem[] = [
    {
        id: 'emprendedores',
        label: 'Emprendedores',
        icon: User,
        path: '/dashboard/emprendedores',
        active: false
    },
    {
        id: 'fincas',
        label: 'Fincas',
        icon: MapPin,
        path: '/dashboard/fincas',
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