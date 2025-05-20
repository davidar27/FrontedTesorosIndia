import  navLinks  from "./Links";
import NavLink from "./NavLink";

const DesktopNav = ({ links }: { links: typeof navLinks }) => (
    <div className="hidden md:flex items-center gap-6">
        {links.map(link => (
            <NavLink key={link.path} to={link.path} label={link.label} />
        ))}
    </div>
);

export default DesktopNav;