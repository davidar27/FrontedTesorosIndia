import { Link } from "react-router-dom";


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
}) => (
  <Link to={to} onClick={onClick} className={className}>
    {label}
  </Link>
);

export default NavLink;