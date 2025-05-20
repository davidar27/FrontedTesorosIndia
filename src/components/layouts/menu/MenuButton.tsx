
const MenuButton = ({
    icon,
    label,
    onClick,
    mobile = false,
    className = ""
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    mobile?: boolean;
    className?: string;
}) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 ${mobile ? 'px-3 py-2 rounded hover:bg-gray-100 text-base' : 'w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors'} ${className}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);
export default MenuButton;