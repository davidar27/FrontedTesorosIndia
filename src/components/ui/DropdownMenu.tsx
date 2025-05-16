import React from "react";

interface DropdownMenuProps {
    children: React.ReactNode;
    className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    children,
    className = "",
}) => {
    return (
        <div
            className={`absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-50 overflow-hidden ${className}`}
        >
            {children}
        </div>
    );
};

export default DropdownMenu;
