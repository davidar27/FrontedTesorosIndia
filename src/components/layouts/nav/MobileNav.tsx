import { Menu, X } from "lucide-react";
import UserMenu from "@/components/layouts/menu/UserMenu";
import Button from "@/components/ui/buttons/Button";
import NavLink from "@/components/layouts/nav/NavLink";
import navLinks from "@/components/layouts/nav/Links";


export const MobileNav = ({
    isOpen,
    toggleMenu,
    closeMenu,
    links
}: {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
    links: typeof navLinks;
}) => (
    <>
        <div className="md:hidden p-0 m-0">
            <button onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
        </div>

        {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white !text-gray-700 shadow-md z-40 px-4 py-3 md:hidden">
                <nav className="flex flex-col gap-3">
                    <div className="border-b">
                        <UserMenu textColor="text-black" />
                    </div>
                    {links.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            label={link.label}
                            onClick={closeMenu}
                            className="hover:text-primary"
                        />
                    ))}
                    <Button className="text-black">
                        <span>Fincas</span>
                    </Button>
                </nav>
            </div>
        )}
    </>
);
