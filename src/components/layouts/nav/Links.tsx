import { User } from "@/interfaces/user";

interface NavLink {
    path: string;
    label: string;
}

const publicLinks: NavLink[] = [
    { path: "/", label: "Inicio" },
    { path: "/nosotros", label: "Nosotros" },
    { path: "/productos", label: "Productos" }
];

const adminLinks: NavLink[] = [
    { path: "/dashboard", label: "Gestionar" }
];

export const getNavLinks = (user: User | null): NavLink[] => {
    if (!user) return publicLinks;
    
    if (user.role === 'administrador') {
        return [...publicLinks, ...adminLinks];
    }
    
    return publicLinks;
};

export default getNavLinks;