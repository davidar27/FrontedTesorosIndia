import React from 'react';

interface PictureProps {
    className?: string;
    src?: string;
    icon?: React.ReactNode;
    alt?: string;
}

const Picture = ({ className, src, icon, alt }: PictureProps) => {
    if (icon) {
        return <span className={className}>{icon}</span>;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
        />
    );
};

export default Picture;