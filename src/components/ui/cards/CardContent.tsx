import React, { ReactNode } from 'react';

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className}) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export default CardContent;