import { Link, useLocation } from "react-router-dom";

const NavLink = ({
  to,
  label,
  onClick,
  className = "hover:text-primary transition-colors"
}: {
  to: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${className} relative py-2 px-1`}
      data-active={isActive}
    >
      {label}
    </Link>
  );
};


export default NavLink;