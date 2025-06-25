import { User } from "@/interfaces/user";

interface NavLink {
    path: string;
    label: string;
}

export const getNavLinks = (user: User | null, experience_id: number): NavLink[] => {
    const publicLinks: NavLink[] = [
        { path: "/", label: "Inicio" },
        { path: "/nosotros", label: "Nosotros" },
        { path: "/productos", label: "Productos" }
    ];

    const adminLinks: NavLink[] = [
        { path: "/", label: "Inicio" },
        { path: "/nosotros", label: "Nosotros" },
        { path: "/dashboard", label: "Panel de Control" }

    ];

    const entrepreneurLinks: NavLink[] = [
        { path: `/experiencias/${experience_id}`, label: "Mi Experiencia" },
        { path: `/experiencias/${experience_id}/estadisticas`, label: "Mis Estadísticas" },
    ];

    if (!user) return publicLinks;

    if (user.role === 'administrador') {
        return [...adminLinks];
    }
    if (user.role === 'emprendedor') {
        return [...publicLinks, ...entrepreneurLinks];
    }

    return publicLinks;
};

export default getNavLinks;